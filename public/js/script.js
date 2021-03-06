(function () {
    Vue.component("comments", {
        template: "#comments-template",
        props: ["imageId"],
        data: function () {
            return {
                comments: [],
                comment: "",
                commentUsername: "",
            };
        },
        mounted: function () {
            var self = this;
            axios
                .get("/comments/" + this.imageId)
                .then(function (res) {
                    if (res.data.error) {
                        console.error(res.data.message);
                    } else {
                        self.comments = res.data;
                    }
                })
                .catch(function (err) {
                    console.error(
                        `erron on axios.get(/comments/${this.imageId}): `,
                        err
                    );
                });
        },
        watch: {
            imageId: function () {
                var self = this;
                axios
                    .get("/comments/" + this.imageId)
                    .then(function (res) {
                        if (res.data.error) {
                            console.error(res.data.message);
                        } else {
                            self.comments = res.data;
                        }
                    })
                    .catch(function (err) {
                        console.error(
                            `erron on axios.get(/comments/${this.imageId}): `,
                            err
                        );
                    });
            },
        },
        methods: {
            addComment: function (e) {
                var self = this;
                e.preventDefault();
                var newComment = {
                    imageId: this.imageId,
                    comment: this.comment,
                    username: this.commentUsername,
                };
                axios
                    .post("/new-comment", newComment)
                    .then(function (res) {
                        if (res.data.error) {
                            console.error(res.data.message);
                        } else {
                            self.comments.unshift(res.data);
                        }
                    })
                    .catch(function (err) {
                        console.error(
                            "erron on axios.post(/new-comment): ",
                            err
                        );
                    });
            },
        },
    });

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
                    if (res.data.error) {
                        console.error(res.data.message);
                    } else {
                        if (res.data.length == 0) {
                            window.history.pushState({}, "", "/");
                            self.$emit("close");
                        } else {
                            self.title = res.data[0].title;
                            self.description = res.data[0].description;
                            self.url = res.data[0].url;
                            self.username = res.data[0].username;
                            self.createdAt = formatDateTime(
                                res.data[0].created_at
                            );
                        }
                    }
                })
                .catch(function (err) {
                    console.error(
                        `erron on axios.get(/image-info/${this.imageId}): `,
                        err
                    );
                });
        },
        watch: {
            imageId: function () {
                var self = this;
                axios
                    .get("/image-info/" + this.imageId)
                    .then(function (res) {
                        if (res.data.error) {
                            console.error(res.data.message);
                        } else {
                            if (res.data.length == 0) {
                                window.history.pushState({}, "", "/");
                                self.$emit("close");
                            } else {
                                self.title = res.data[0].title;
                                self.description = res.data[0].description;
                                self.url = res.data[0].url;
                                self.username = res.data[0].username;
                                self.createdAt = res.data[0].created_at;
                            }
                        }
                    })
                    .catch(function (err) {
                        console.error(
                            `erron on axios.get(/image-info/${this.imageId}): `,
                            err
                        );
                    });
            },
        },
        methods: {
            closeModal: function () {
                window.history.pushState({}, "", "/");
                this.$emit("close");
            },
            deleteImage: function () {
                window.history.pushState({}, "", "/");
                this.$emit("close");
                axios
                    .get("/delete-image/" + this.imageId)
                    .then(function () {
                        console.log(`image with id ${imageId} was deleted`);
                    })
                    .catch(function (err) {
                        console.error(
                            `erron on axios.get(/delete-image/${this.imageId}): `,
                            err
                        );
                    });
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
            imageId: location.hash.slice(1),
        },
        mounted: function () {
            var self = this;
            axios
                .get("/images")
                .then(function (res) {
                    if (res.data.error) {
                        console.error(res.data.message);
                    } else {
                        self.images = res.data;
                    }
                })
                .catch(function (err) {
                    console.error("erron on axios.get(/images): ", err);
                });
            addEventListener("hashchange", function () {
                self.imageId = location.hash.slice(1);
            });
        },
        watch: {
            // imageId: function () {
            //     var self = this;
            //     axios
            //         .get("/images")
            //         .then(function (res) {
            //             if (res.data.error) {
            //                 console.error(res.data.message);
            //             } else {
            //                 self.images = res.data;
            //             }
            //         })
            //         .catch(function (err) {
            //             console.error("erron on axios.get(/images): ", err);
            //         });
            // },
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
                        if (res.data.error) {
                            console.error(res.data.message);
                        } else {
                            self.images.unshift(res.data);
                        }
                    })
                    .catch(function (err) {
                        console.error("erron on axios.post(/upload): ", err);
                    });
            },
            closeMe: function () {
                this.imageId = null;
            },
            showMore: function () {
                var lastImageId = this.images[this.images.length - 1].id;
                var self = this;
                axios
                    .get("/show-more/" + lastImageId)
                    .then(function (res) {
                        if (res.data.error) {
                            console.error(res.data.message);
                        } else {
                            for (var i = 0; i < res.data.length; i++) {
                                self.images.push(res.data[i]);
                            }
                            if (
                                res.data[0].lowestId ==
                                self.images[self.images.length - 1].id
                            ) {
                                document
                                    .getElementsByClassName("more")[0]
                                    .classList.add("hide");
                            }
                        }
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

    const formatDateTime = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(new Date(date));
    };
})();
