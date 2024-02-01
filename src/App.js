import React, { useRef, useState } from 'react';
import SubtitlesParser from 'subtitles-parser';
import Modal from 'react-modal';

const App = () => {
    const videoRef = useRef(null);
    const [subtitleData, setSubtitleData] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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
            videoRef.current.load();
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
            <button onClick={openModal}>Open Upload Modal</button>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <h2>Upload Components</h2>
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
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default App;
