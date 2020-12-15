new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        image: null,
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
    methods: {
        handleFileChange: function (e) {
            this.image = e.target.files[0];
        },
        handleUpload: function (e) {
            e.preventDefault();
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("image", this.image);
            axios.post("/upload", formData).then((res) => {
                this.images.unshift(res.data);
            });
        },
    },
});
