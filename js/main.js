'use strict';

$(document).ready(function () {
    $('#comment-form').submit(function (e) {
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: 'save-comment.php', // URL to save the comment
            data: formData,
            success: function (response) {
                // Handle success response
                let data = JSON.parse(response);
                if (data.success) {
                    // Réinitialiser les champs du formulaire
                    $('#comment-form')[0].reset();
                    // Afficher le message de succès
                    $('#comment-success').text(data.message).addClass('text-success').show();
                    // getComments();
                    comments.push(data.comment);
                    // Rendre à nouveau la liste des commentaires
                    renderComments();
                    // Mettre à jour la pagination
                    renderPagination();
                } else {
                    // Afficher les erreurs de validation
                    let errors = data.errors;
                    let errorText = '';
                    for (let i = 0; i < errors.length; i++) {
                        errorText += '<p>' + errors[i] + '</p>';
                    }
                    $('#comment-success').html(errorText).removeClass('text-success').addClass('text-danger').show();
                }
            },
            error: function (xhr, status, error) {
                // Handle error
                console.log(xhr, status, error);
            }
        });
    });

    var currentPage = 1;
    var commentsPerPage = 3;
    var comments = [];

    function getComments() {
        $.getJSON('comments.json', function (data) {
            comments = data;
            renderComments();
            renderPagination();
        });
    }

    function renderComments() {
        let startIndex = (currentPage - 1) * commentsPerPage;
        let endIndex = startIndex + commentsPerPage;
        let commentList = $('#comment-list');
        commentList.empty();

        for (let i = startIndex; i < endIndex && i < comments.length; i++) {
            let comment = comments[i];
            let commentHtml = `
                    <div class="comment">
                        <p>${comment.message}</p>
                        <p>${comment.nom}  ${comment.prenom}</p>
                        <p class="date">${comment.lieu},${comment.date}</p>
                    </div>
                `;
            commentList.append(commentHtml);
        }
    }

    function renderPagination() {
        let totalPages = Math.ceil(comments.length / commentsPerPage);
        let pagination = $('#pagination');
        pagination.empty();

        for (let i = 1; i <= totalPages; i++) {
            let pageLink = $('<a>', {
                href: '#',
                text: i,
                class: currentPage === i ? 'active' : '',
                'data-page': i
            });

            pageLink.click(function (e) {
                e.preventDefault();
                currentPage = parseInt($(this).data('page'));
                renderComments();
                renderPagination();
            });

            pagination.append(pageLink);
        }
    }
    getComments();

    // Function to load and render the PDF
    function renderPDF(url) {
        // Asynchronous download of PDF
        pdfjsLib.getDocument(url).promise.then(function (pdfDoc) {
            // console.log("This file has " + pdfDoc._pdfInfo.numPages + " pages");
            const numPages = pdfDoc.numPages;
            console.log(numPages);

            // Fetch the first page
            pdfDoc.getPage(1).then(function (page) {
                let viewport = page.getViewport({ scale: 1 });
                // var canvas = document.createElement("canvas");
                let canvas = document.getElementById("pdfCanvas");
                canvas.style.display = "block";
                let context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                // canvasContainer.appendChild(canvas);

                // Render the page
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                page.render(renderContext);
            });
        });
    }
    renderPDF("assets/docs/Faire_part_Sewa_MENSAH.pdf");

     // Function to get image names from the server
    function fetchImageNames(callback) {
        $.ajax({
            url: 'get_image_names.php', // Replace with the actual server-side script to get image names
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // Call the callback function with the fetched image names
                console.log(data);
                callback(data);
            },
            error: function(error) {
                console.error('Error fetching image names:', error);
                // Call the callback function with an empty array in case of an error
                callback([]);
            }
        });
    }
    var sliderContainer = $('.slider');
    // Fetch image names dynamically and create the slider
    fetchImageNames(function(imageNames) {
        // Shuffle the array to display images randomly
        imageNames.sort(function() { return 0.5 - Math.random() });

        // Add the images to the slider
        imageNames.forEach(function(imageName) {
            let imageUrl = 'assets/img/' + imageName;
            let slide = $('<div><img src="' + imageUrl + '" class="img-fluid" alt="photos obsèques"></div>');
            sliderContainer.append(slide);
        });

        // Initialize the Slick Carousel
        sliderContainer.slick({
            dots: true, // Show dots for navigation
            infinite: true, // Enable infinite loop
            autoplay: true, // Enable autoplay
            autoplaySpeed: 2000, // Set the autoplay speed (in milliseconds)
            fade:true,
            cssEase:'linear'
        });
    });
});
