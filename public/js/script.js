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
