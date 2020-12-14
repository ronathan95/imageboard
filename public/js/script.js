// new Vue({
//     el: "#main",
//     data: {
//         name: "Jasmine",
//         seen: false,
//         cities: [],
//         myClassName: "peter",
//     },
//     // mounted is a lifecycle method that can be accessed
//     mounted: function () {
//         // console.log("my Vue component has mounted!");
//         console.log("this before axios: ", this);
//         var self = this;
//         axios
//             .get("/cities")
//             .then(function (response) {
//                 console.log("self: ", self);
//                 console.log("response.data: ", response.data);
//                 console.log("this inside then: ", this);
//                 self.cities = response.data;
//             })
//             .catch(function (err) {
//                 console.error("error: ", err);
//             });
//     },
//     methods: {
//         petesMethod: function (city) {
//             console.log("Pete's method :)", city);
//             // change the value of the name on data
//             this.name = city;
//         },
//     },
// });

new Vue({
    el: "#gallery",
    data: {
        images: [],
    },
    mounted: function () {
        var self = this;
        axios
            .get("/images")
            .then(function (res) {
                self.images = res.data;
            })
            .catch(function (err) {
                console.error("erron on axios.get(/images): ", err);
            });
    },
});
