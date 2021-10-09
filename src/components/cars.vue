<template lang="html">
  <div class="container prof" id="content">
    <flash-message v-if="flashalert" class="" autoHide variant="success" transitionIn="animated rubberBand"></flash-message>
    <div class="row">
      <div class="col-md-12  col-lg-12 mx-auto">
        <div class="card shadow-lg bg-white">
          <div class="card-header">
            <h2>Cars</h2>
          </div>
          <div class="card-body">
            <!-- <b-table hover :items="getCars"></b-table> -->
            <table class="table">
              <thead>
                <th scope="col">Plate</th>
                <th scope="col">Brand</th>
                <th scope="col">Model</th>
                <th scope="col">Seat</th>
                <th scope="col">Year</th>
                <!-- <th scope="col">Edit</th> -->
                <th scope="col">Delete</th>
              </thead>
              <tbody>
                <tr v-for="(item, index) in getCars" :key="index">
                  <td><img class="taxiimage" src="@/assets/taxi2.png"><b>{{item.license_plate}}</b></td>
                  <td>{{item.brand}}</td>
                  <td>{{item.model}}</td>
                  <td>{{item.seat}}</td>
                  <td>{{item.year}}</td>
                  <!-- <td><b-button v-on:click="setEditingCar(item.brand, item.model, item.seat, item.year)" v-b-modal.myEditModal variant="info"><img src="@/assets/edit3.png"></b-button></td> -->
                  <td><b-button v-if="item.license_plate!=getActualCar" v-on:click="deleteCar(item.license_plate)" variant="danger"><span aria-hidden="true">&times;</span></b-button></td>
                </tr>
              </tbody>
            </table>
            <b-button v-b-modal.myCreateCarModal variant="success"><b>+</b> New</b-button>
          </div>
        </div>
      </div>

    </div>
   </b-table>
        <!-- the modal -->
        <b-modal id="myEditModal" ref="myEditModal" title="Edit Car" @ok="">
          <form @submit.stop.prevent="">
            <b>Plate</b>
            <b-form-input type="text" placeholder="Plate" v-model="editingCar.brand" autofocus></b-form-input>
            <b>Model</b>
            <b-form-input type="text" placeholder="Model" v-model="editingCar.model" autofocus></b-form-input>
            <b>Seat</b>
            <b-form-input type="text" placeholder="Seat" v-model="editingCar.seat" autofocus></b-form-input>
            <b>Year</b>
            <b-form-input type="text" placeholder="year" v-model="editingCar.year" autofocus></b-form-input>
          </form>
        </b-modal>

        <b-modal id="myCreateCarModal" ref="myCreateModal" title="Add Car" @ok="createNewCar()">
          <form @submit.stop.prevent="">
            <b-form-input class="newcar" type="text" placeholder="Plate" v-model="creatingCar.plate" autofocus></b-form-input>
            <b-form-input class="newcar" type="text" placeholder="Brand" v-model="creatingCar.brand" autofocus></b-form-input>
            <b-form-input class="newcar" type="text" placeholder="Model" v-model="creatingCar.model" autofocus></b-form-input>
            <b-form-input class="newcar" type="text" placeholder="Seat" v-model="creatingCar.seat" autofocus></b-form-input>
            <b-form-input class="newcar" type="number" placeholder="Year" v-model="creatingCar.year" autofocus></b-form-input>
          </form>
        </b-modal>
      </div>
</template>

<script>

export default {
  name: 'cars',
  components: {

  },
  computed:{
    getCars(){
      return this.$store.getters.cars;
    },
    getActualCar(){
      console.log(this.$store.getters.ActualCar);
      return this.$store.getters.ActualCar;
    }
  },
  data(){
    return{
      flashalert: false,
      editingCar: {plate: null, brand: null, model: null, seat: null, year: null},
      creatingCar: {plate: null, brand: null, model: null, seat: null, year: null}
    }
  },
  beforeCreate(){

    this.$store.dispatch('carsInfo');

  },
  methods: {
    createNewCar(){
      this.$store.dispatch('sendNewCar', this.creatingCar)
        .then(() => {
          this.$store.dispatch('carsInfo');
        })
    },
    deleteCar(license_plate){
      this.$store.dispatch('deleteCar', license_plate)
        .then(() => {
          this.$store.dispatch('carsInfo');
        })
    },
    setEditingCar(brand, model, seat, year){
      this.editingCar = {brand: brand, model: model, seat: seat, year: year};
    }
  },
  updated(){
    setTimeout(() => {
      this.flashalert = false;
    }, 2000);
  }
}
</script>

<style lang="css">
  .prof{
    margin-top: 25px;
  }
  #profileMap{
    height: 600px;
  }
  .myclose{
    margin-right: 50px;
    width:12px;
  }

  thead{
    background-color: black;
    color: white;
  }

  .taxiimage{
    width: 50px;
    height: 50px;
  }

  .newcar{
    margin-top: 15px;
  }

</style>
