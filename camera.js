


    // GLOBAL VARIABLES

    
    const URL = "https://teachablemachine.withgoogle.com/models/sbLyo8ssx/";
    // added some changes

    let model, webcam, labelContainer, maxPredictions;
    const stopbutt = document.getElementById('stop')

    const play = document.getElementById('play')
    let pause = document.getElementById('pause')

    const container = document.getElementById('webcam-container')
    let ispause = false

    const pane_3 = document.getElementsByClassName('pane-3')
    const notice = document.getElementsByClassName('notice')

    const menulist = document.getElementsByClassName('menulist')
    const menu = document.getElementById('menu')

    const say = document.getElementsByClassName('say')


    

    // EVENT LISTERNERS
    // ===============================================================

    pause.addEventListener('click', async () => {
        window.location.href = '/home'
    })

   
    menu.addEventListener('click',()=>{
         menulist[0].style.marginLeft = 0
         menulist[0].style.transition = 0.5 +'s'
    })


    // PLAY BUTTON

    play.addEventListener('click', async () => {


        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        pane_3[0].style.marginLeft = 0
        pane_3[0].style.transition = 0.5 +'s'
        container.style.left = 50 + '%'
        container.style.transition = 0.5 +'s'
        notice[0].style.display = 'none'
        say[0].style.display = 'none'
        say[0].style.transition = 0.5 + 's'


        container.style.borderRadius = 10 + 'px'
        container.style.width = 520 + 'px'
        container.style.transition = 0.5 + 's'




        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL,metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(520, 590, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);




        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }

        container.addEventListener('mouseover', () => {
            pause.style.display = 'block'
        })
        container.addEventListener('mouseout', () => {
            pause.style.display = 'none'
        })
        pause.addEventListener('mouseover', () => {
            pause.style.display = 'block'
        })

        play.style.display = 'none'

    })



    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {

            if (prediction[i].probability.toFixed(2) > 0.8) {

                const classPrediction = prediction[i].className;
                labelContainer.childNodes[i].innerHTML = classPrediction;

            } else {

                // const classPrediction =null;
                const classPrediction = prediction[i].className;
                labelContainer.childNodes[i].innerHTML = '';

            }

        }
    }