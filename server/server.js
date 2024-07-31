const express = require('express')
const app = express()
const fs = require('fs')
const dotenv = require('dotenv');
const comman = require('./common')
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
app.use(express.json());
const {createStoryboardPayload} = require('./payload')

/*const videoFileMap = {
    'cdn': 'videos/video.mp4',
    'generate-pass': 'videos/generate-pass.mp4',
    'get-post': 'videos/get-post.mp4',
}

app.get('/videos/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = videoFileMap[fileName]
    if (!filePath) {
        return res.status(404).send('File not found')
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res)
    }
})*/
/*app.get("/api", (req, res) => {
    res.json({ "users": ["Hello. My name is Vandana Chella, and I'm the vice president IT and AI at KK Enterprise, a pioneer company known for integrating latest audio and video technology into its range of innovative gift products. I believe in the power of technology to transform the way people connect and express themselves, And I am dedicated to pushing the boundaries of what is possible in the gifting industry. I'm working towards driving the company's digital transformation and enhancing the customer experience through intelligent solutions.",] })
})*/

const videoFileAI = {
    'textVideo': 'videos/texttovideo.mp4',
}
app.get('/videos/:filename', (req, res) => {
    const fileNames = req.params.filename;
    const filePaths = videoFileAI[fileNames]
    async function createTextToVideo() {
      console.log("Step 1/6:  Fetching Auth token: Running ");
      const token = await comman.getToken(CLIENT_ID, CLIENT_SECRET);
    
      console.log("Step 2/6 Status: in-progress Generating Video Preview Step.");
      const jobid = await comman.createPreviewStoryboard(token);
    
      console.log("Step 3/6 Status: Waiting for Video Preview.");
      const data = await comman.waitForStoryboardJobToComplete(token, jobid);
    
      console.log("Step 4/6 : Status: in-progress sending Video Generation Request.");
      const rander_jobid = await comman.createVideoRender(token, data);
    
      console.log("Step 5/6: Video generation Request Sent. now waiting for video generation to complete video");
      const url = await comman.waitForRenderJobToComplete(token, rander_jobid);
    
      comman.downloadVideo(url, "C:\\Users\\user\\Desktop\\Santsai\\gift360\\api\\api\\public\\texttovideo.mp4");
      console.log("Completed: Video downloaded with name texttovideo.mp4 complete");
    
    }
    createTextToVideo()
    if (!filePaths) {
        return res.status(404).send('File not found')
    }

    const stat = fs.statSync(filePaths);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = end - start + 1;
        const file = fs.createReadStream(filePaths, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePaths).pipe(res)
    }
})

app.post('/users_text', async(req, res) => {
    console.log(req.body);
    console.log("Before Create Story")
    await createStoryboardPayload([req.body.projectIdea]);
    console.log("After Create Story")
})

app.listen(5001, () => { console.log("server started on port 5001") })