(function () {
    Vue.component("image-info", {
        template: "#template",
        props: ["imageId"],
        data: function () {
            return {
                title: "",
                description: "",
                url: "",
                username: "",
                createdAt: "",
            };
        },
        mounted: function () {
            var self = this;
            axios
                .get("/image-info/" + this.imageId)
                .then(function (res) {
                    self.title = res.data[0].title;
                    self.description = res.data[0].description;
                    self.url = res.data[0].url;
                    self.username = res.data[0].username;
                    self.createdAt = res.data[0].created_at;
                })
                .catch(function (err) {
                    `erron on axios.get(/image-info/${this.imageId}): `, err;
                });
        },
        methods: {
            closeModal: function () {
                this.$emit("close");
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            image: null,
            imageId: null,
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
                var self = this;
                e.preventDefault();
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("image", this.image);
                axios
                    .post("/upload", formData)
                    .then(function (res) {
                        self.images.unshift(res.data);
                    })
                    .catch(function (err) {
                        console.error("erron on axios.post(/upload): ", err);
                    });
            },
            getImageId: function (imageId) {
                this.imageId = imageId;
            },
            closeMe: function () {
                this.imageId = null;
            },
            showMore: function () {
                var self = this;
                var lastImageId = this.images[5].id;
                axios
                    .get("/show-more/" + lastImageId)
                    .then(function (res) {
                        self.images = res.data;
                        //self.images.push(res.data);
                    })
                    .catch(function (err) {
                        console.error(
                            `erron on axios.get(/show-more/${lastImageId}): `,
                            err
                        );
                    });
            },
        },
    });
})();
