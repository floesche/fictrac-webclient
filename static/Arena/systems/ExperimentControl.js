const addRestartButton = (container) => {
    const restartExperiment = document.createElement("button");
        restartExperiment.innerHTML = "Restart";
        restartExperiment.style.position = "absolute";
        restartExperiment.style.visibility = "hidden";
        restartExperiment.classList.add("experiment-controller");
        restartExperiment.style.top = "20%";
        restartExperiment.style.left = "40%";
        container.appendChild(restartExperiment);

        restartExperiment.addEventListener('click', function () {
            window.location.reload();
        });

        window.addEventListener('end-experiment', () => {
            restartExperiment.style.visibility = "visible";
        });
};

const addStartButton = (container) => {
    const startExperiment = document.createElement("button");
    startExperiment.innerHTML = "Start";
    startExperiment.style.position = "absolute";
    startExperiment.style.visibility = "visible";
    startExperiment.classList.add("experiment-controller");
    startExperiment.style.top = "20%";
    startExperiment.style.left = "60%";
    container.appendChild(startExperiment);

    startExperiment.addEventListener('click', function () {
        const controllers = container.getElementsByClassName('experiment-controller');
        for (const element of controllers) {
            element.style.visibility = "hidden";
        }
        const startEvent = new Event('start-experiment');
        window.dispatchEvent(startEvent);
    });
};


class ExperimentControl{
    constructor(container){
        addRestartButton(container);
        addStartButton(container);
    }
}

export { ExperimentControl };
