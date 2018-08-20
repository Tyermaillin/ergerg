const fetch = require('node-fetch')

const SteamID = require('steamid');

let {Salien} = require('../db/models/user')

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    Salien.find({}).then(result => {

        let item = []
        result.forEach(element => {
            item.push({
                element,
                owned: null
            })
        })

        return res.send({
            item
        })
    })
})

router.post('/', (req, res) => {
    let user_id = req.body.user_id.trim()

    if (!user_id) {
        return res.status(406).send({
            response: 'You must enter an ID!'
        })
    }

    let sid = new SteamID(user_id)

    if (!sid.isValid()) {
        return res.status(406).send({
            response: 'Invalid ID!'
        })
    }

    user_id = sid.getSteamID64()
    
    let steam_inventory = `https://steamcommunity.com/inventory/${user_id}/753/6?l=english&count=5000`
    
    async function findItems() {
        const response = await fetch(steam_inventory, {method: 'GET'})
        let json = await response.json()      


        let items = []

        if (json.success == 1) {
            json.descriptions.forEach(element => {
                if (element.type.includes('Sale Item')) {
                    items.push(element.icon_url)   
                }
            });
        } else {
            return res.status(500).send({
                response: 'Something went wrong'
            })
        }
        
        return items
    }

    findItems()
        .then(data => {

            
            // Got all Saliens Items from Steam Inventory
            // data.forEach(element => {
            //     Salien.create({salien_item: element}, (err, result) => {
            //         if (err) return console.log(err);      
            //     })   
            // })

            
            // Salien.find({'salien_item.icon_url': {$in: data}}) > Search for multiple elements


            // Compare all elements from database with the user inventory
                Salien.find({}).then(all_items => {
                    let item = [] // items that the user already have
                    let unowned = [] // items that the user have to collect
                    all_items.forEach(element => {
                        if (data.includes(element.salien_item.icon_url)) {
                            item.push({
                                element,
                                owned: true
                            })
                        } else{
                            unowned.push({
                                element,
                                owned: false
                            })
                        }
                    });
                    

                    // Concat 'item' with 'unowned' to get one array with all items
                    // Elements from 'item' wich have owned: true value, will come first
                    Array.prototype.push.apply(item, unowned)
                    
                    return res.status(200).send({
                        item,
                        items_owned: data.length,
                        all_items: item.length
                    })
            })
        }).catch(err => console.log(err))
})

module.exports = router;