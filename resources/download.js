import GIF from 'gif.js';

export async function getGif(stamp) {
    const gifName = stamp.frames.substring(stamp.frames.lastIndexOf("/") + 1);

    const frames = await cutFrames(stamp.frames, stamp.width, stamp.height);
    const gif = await createGif(frames, stamp.frameTimes);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(gif);
    a.download = gifName;
    a.click();
    URL.revokeObjectURL(a.href);
}

async function cutFrames(framesUrl, width, height) {
    const image = new Image();
    image.src = framesUrl;
    await image.decode();

    const frames = [];
    console.log(image.width, width);
    const cols = Math.floor(image.width / width);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    for (let x = 0; x < cols; x++) {
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 
            (x * width), 0, width, height, // Координаты x, y, высота и ширина изображения (Исходник)
            0, 0, width, height // Координаты x, y, высота и ширина изображения (Получатель)
        );
        frames.push(canvas.toDataURL("image/png")); // base64 кадр
    }

    return frames;
}

function createGif(frames, frameTimes) {
    return new Promise((resolve) => {
        const gif = new GIF({workers: 2, quality: 10});

        frames.forEach((frame, index) => {
            const img = new Image();
            img.src = frame;
            gif.addFrame(img, {delay: frameTimes[index]});
        });

        gif.on('finished', function(blob) {
            resolve(blob);
        });

        gif.render();
    });
}

window.getGif = getGif;