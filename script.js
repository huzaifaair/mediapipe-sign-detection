const video = document.getElementById('input_video');
const canvas = document.getElementById('output_canvas');
const ctx = canvas.getContext('2d');

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
  });
  video.srcObject = stream;
  await new Promise(resolve => video.onloadedmetadata = resolve);
  video.play();
}

const hands = new window.Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8,
});

hands.onResults(results => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    ctx.fillStyle = "#00FF00";
    results.multiHandLandmarks[0].forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
});

setupCamera().then(() => {
  const sendFrame = async () => {
    await hands.send({ image: video });
    requestAnimationFrame(sendFrame);
  };
  sendFrame();
});
