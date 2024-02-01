import React, {useRef, useState} from 'react';
import SubtitlesParser from 'subtitles-parser';

const App = () => {
    const videoRef = useRef(null);
    const [subtitleText, setSubtitleText] = useState('');
    const [subtitleData, setSubtitleData] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);

    const loadSubtitle = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const subtitles = SubtitlesParser.fromSrt(e.target.result);
            setSubtitleData(subtitles);
        };

        reader.readAsText(file);
    };

    const handleSubtitleChange = (e) => {
        if (e.target.files.length > 0) {
            loadSubtitle(e.target.files[0]);
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files.length > 0) {
            const videoFile = e.target.files[0];
            videoRef.current.src = URL.createObjectURL(videoFile);
            videoRef.current.load(); // Add this line to reload the video and trigger the update

            console.log(videoRef.current.src);
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    const timeToSeconds = (timeString) => {
        const [hh, mm, ss] = timeString.split(':').map(parseFloat);
        const seconds = hh * 3600 + mm * 60 + ss;

        // Extract milliseconds from the time string
        const milliseconds = parseFloat(timeString.split(',')[1]) / 1000;

        return seconds + milliseconds;
    };


    const renderSubtitle = () => {
        const currentSubtitle = subtitleData.find(
            (subtitle) =>
                currentTime >= timeToSeconds(subtitle.startTime) &&
                currentTime <= timeToSeconds(subtitle.endTime)
        );

        return currentSubtitle ? currentSubtitle.text : '';
    };

    return (
        <div>
            <label>
                Choose Video:
                <input type="file" accept=".mp4" onChange={handleVideoChange}/>
            </label>
            <br/>
            <label>
                Choose Subtitle:
                <input type="file" accept=".srt" onChange={handleSubtitleChange}/>
            </label>
            <br/>
            <div className='player-container'>
                <video
                    className='video'
                    controls
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate}
                >
                    <source src="" type="video/mp4"/>
                </video>
                <div className='subtitle'>{renderSubtitle()}</div>
            </div>
        </div>
    );
};

export default App;
