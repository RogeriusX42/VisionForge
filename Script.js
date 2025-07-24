const videoElement = document.getElementById('video');
const output = document.getElementById('output');

const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(results => {
  if (!results.multiHandLandmarks[0]) {
    return output.innerText = "Mão não detectada";
  }

  const landmarks = results.multiHandLandmarks[0];
  const fingerStates = [false, false, false, false, false];

  const isFingerUp = (tip, pip) => landmarks[tip].y < landmarks[pip].y;

  fingerStates[0] = landmarks[4].x < landmarks[3].x;
  fingerStates[1] = isFingerUp(8, 6);
  fingerStates[2] = isFingerUp(12,10);
  fingerStates[3] = isFingerUp(16,14);
  fingerStates[4] = isFingerUp(20,18);

  const count = fingerStates.filter(x => x).length;
  const binary = count.toString(2).padStart(4, '0');
  output.innerText = `🧠 Detectado: ${count} dedos → Binário: ${binary}`;
});

const camera = new Camera(videoElement, {
  onFrame: async () => await hands.send({image: videoElement}),
  width: 640,
  height: 480
});
camera.start();
