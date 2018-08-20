<template>
  <div class="salien">

    <div class="form">
      <div class="user_id">
        <form @submit.prevent="check_items()">

          <input @input="error = null" v-model="user" placeholder="SteamId 64" required type="text">
          <button class="submit_btn">Submit</button>

          <p v-if="error">{{ error }}</p>

          <div v-if="loading">
            <p>Loading...</p>
          </div>

        </form>
      </div>


       <div class="info">
        
          <div v-if="loading" class="loading">
            <img class="loading_img" src="@/assets/Planet42.png" alt="">
          </div>

          <div v-if="!loading">
            <p v-if="items_amount">You own {{ items_owned }} / {{ items_amount }} items</p>
          </div>
          
        </div>

      <div class="search">

        <input type="search" v-model="item_searched" placeholder="Search...">

<div class="checkbox">
        <div>
          <label for="hide_owned">Hide Collected</label>
          <input id="hide_owned" v-model="hide.items_owned" type="checkbox" /><br>
        </div>

        <div>

        <label for="hide_uncollected">Hide Uncollected</label>
        <input id="hide_uncollected" v-model="hide.items_uncollected" type="checkbox" />
        </div>
</div>
      </div>


    </div>

    <div class="items">
      <div ref="box" v-for="(salien, index) in search_item" :key="index">
            <div class="item_box">
                <p class="item_index">{{ index + 1}} <span v-if="salien.owned" class="owned_item">Owned</span>
                <span v-if="salien.owned == false" class="uncollected_item">Uncollected</span></p>

                <img class="salien_item" :src="img_url+salien.element.salien_item.icon_url+'/62fx62f'" alt="Img not Found">
                <a target="_blank" :href="market_url+salien.element.salien_item.market_hash_name">
                  <p>{{ salien.element.salien_item.market_name }}</p>
                </a>
            </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Saliens',

    data() {
      return {
        img_url: "https://steamcommunity-a.akamaihd.net/economy/image/",
        market_url: 'https://steamcommunity.com/market/listings/753/',

        saliens: [],
        user: '',
        items_owned: '',
        items_amount: '',
        item_searched: '',
        hide: {
          items_owned: false,
          items_uncollected: false
        },

        error: null,
        loading: false
      }
    },

    computed:{
        search_item(){
        let arr = this.saliens

        let items = arr.filter(el => {
          return el.element.salien_item.market_name.toLowerCase().includes(this.item_searched.toLowerCase().trim())      
        })
   
        if (this.hide.items_owned && this.hide.items_uncollected) {
          return []
        }if (this.hide.items_owned) {
          return items.filter(el => {                 
              return !el.owned
          })  
        }if (this.hide.items_uncollected) {      
          return items.filter(el => {
              return el.owned
          })    
        }else{
          return items
        }

      },
    },

    methods: {
      check_items() {
        this.error = ''
        this.loading = true
        this.$http.post('http://206.189.198.86:3000/inv', {
          user_id: this.user
        }).then(result => {
          let data = result.body
          this.loading = false
          this.saliens = data.item
          this.items_owned = data.items_owned
          this.items_amount = data.all_items

        }).catch(err => {
          this.loading = false        
          if (err.body) {
            this.error = err.body.response
          }
        }) 
      }
    },

    created() {
      this.$http.get('http://206.189.198.86:3000/inv').then(response => {
        this.saliens = response.body.item 
      })
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  @import url('https://fonts.googleapis.com/css?family=Roboto');

  *{
    box-sizing: border-box;
    margin: 0px;
    padding: 0px
  }

  body{
    background: rgb(61, 71, 125);
    font-family: 'Roboto', sans-serif;
  }

  .items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-column-gap: 1rem;
    grid-row-gap: 2rem;
    justify-items: center;
    /* width: 100vw; */
    margin: 4rem 50px;
  }

  .item_box{
    background: rgb(13, 39, 86); 
    height: 180px; 
    width: 180px; 
    /* border: 0px solid rgb(255, 255, 255); */
    border-radius: 30px;
    box-shadow: rgb(171, 76, 76) 3px 3px 0px 4px;
    color: white;
    padding: 1rem;
    display: grid;
    grid-gap: 0.4rem;
    justify-items: center;
    transition: all 0.2s linear;
  }

  .item_box:hover{
    transform: scale(1.05);
    box-shadow: #007755 3px 3px 0px 4px;
  }

  .item_index{
    justify-self: flex-start;
    margin: -4px 0px 0.6rem -4px;
  }

  .salien_item{
    background: #311D3E;
    border-width: 6px 3px; 
    border-style: solid; 
    border-color: rgb(80, 62, 127) rgba(80, 62, 128, 0.8) rgba(80, 62, 127, 0.6) rgb(80, 62, 127); 
    border-radius: 10px;
  }

  .items img {
    height: 64px;
    width: 64px;
  }

  .info{
    border-right: 2px solid white;
    border-left: 2px solid white;
  }

  .form{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 4rem 2rem;
    background: rgb(13, 39, 86);
    color: white;
    margin-bottom: rem;
    justify-content: center;
    grid-gap: 8rem;
    height: 220px;

    box-shadow: rgb(255, 255, 255) 0px 80px 0px -78px;
  }
  .user_id form{
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 1.5rem;
    grid-row-gap: 2rem;
    text-align: start;
    justify-self: flex-start;
    
  }

  .search{
    display: grid;
    grid-template-columns: auto;
    justify-self: flex-end;
    align-self: flex-start;
    text-align: start;
    grid-gap: 0.8rem;
  }

  .loading_img{
    height: 120px;
    width: 120px;

    animation: planet_rotation 3s infinite linear;
  }

  input{
  height: 1.6rem;
  font-size: 1rem;
  padding-left: 0.8rem;
  border: white;
  color: black;
  border-radius: 4px;
  }

  input:focus{
    outline: none;

  }

  .owned_item{
    margin-left: 34px;
    color: white;
    padding: 0.2rem 0.4rem;
    border-radius: 8px;
    background: #007755;
  }

  .uncollected_item{
    color: white;
    background: #D62246;
    border-radius: 8px;
    padding: 0.2rem 0.4rem;
    margin-left: 15px;
  }

  .checkbox div{
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 2rem;
  }

  a{
    color: white;
    text-decoration: none;
  }

.submit_btn{
  background: transparent;
  padding:0.35em 1.2em;
  border:0.1em solid #FFFFFF;
  margin:0 0.3em 0.3em 0;
  border-radius:0.12em;
  box-sizing: border-box;
  text-decoration:none;
  font-family:'Roboto',sans-serif;
  font-weight:300;
  color:#FFFFFF;
  text-align:center;
  transition: all 0.2s;
}.submit_btn:hover{
  color:#000000;
  background-color:#FFFFFF;
  cursor: pointer;
}

  @keyframes planet_rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }


  @media screen and (max-width: 900px) {
  .items {
    margin: 2rem 10px;
  }
  .form{
    grid-template-columns: 1fr;
    height: 600px;
    grid-gap: 1rem;
  }
  .search{
    grid-row: 2/3;
    justify-self: flex-start;
  }

  .user_id form{
    grid-template-columns: 1fr;
  }
}

  @media screen and (max-width: 1080px) {
  .form{
    grid-template-columns: 1fr;
    height: 600px;
    grid-gap: 1rem;
  }
  .search{
    grid-row: 2/3;
    justify-self: flex-start;
  }
}

</style>