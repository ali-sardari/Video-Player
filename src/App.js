import React, {useRef, useState} from 'react';
import SubtitlesParser from 'subtitles-parser';
import Modal from 'react-modal';

const App = () => {
    const videoRef = useRef(null);
    const [subtitleEnData, setSubtitleEnData] = useState([]);
    const [subtitleFaData, setSubtitleFaData] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const loadSubtitleEn = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const subtitle = SubtitlesParser.fromSrt(e.target.result);
            setSubtitleEnData(subtitle);
        };

        reader.readAsText(file);
    };

    const loadSubtitleFa = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const subtitle = SubtitlesParser.fromSrt(e.target.result);
            setSubtitleFaData(subtitle);
        };

        reader.readAsText(file);
    };

    const handleSubtitleEnChange = (e) => {
        if (e.target.files.length > 0) {
            loadSubtitleEn(e.target.files[0]);
        }
    };

    const handleSubtitleFaChange = (e) => {
        if (e.target.files.length > 0) {
            loadSubtitleFa(e.target.files[0]);
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

    const renderSubtitleEn = () => {
        const currentSubtitle = subtitleEnData.find(
            (subtitle) =>
                currentTime >= timeToSeconds(subtitle.startTime) &&
                currentTime <= timeToSeconds(subtitle.endTime)
        );

        return currentSubtitle ? currentSubtitle.text : '';
    };

    const renderSubtitleFa = () => {
        const currentSubtitle = subtitleFaData.find(
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
                <div className='subtitle-en'>{renderSubtitleEn()}</div>
                <div className='subtitle-fa'>{renderSubtitleFa()}</div>
            </div>
            <button onClick={openModal}>Open Upload Modal</button>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <h2>Upload Components</h2>
                <label>
                    Choose Video:
                    <input type="file" accept=".flv, .mp4, .mkv" onChange={handleVideoChange}/>
                </label>
                <br/>
                <label>
                    Choose Subtitle(EN):
                    <input type="file" accept=".srt" onChange={handleSubtitleEnChange}/>
                </label>
                <label>
                    Choose Subtitle(FA):
                    <input type="file" accept=".srt" onChange={handleSubtitleFaChange}/>
                </label>
                <br/>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default App;
