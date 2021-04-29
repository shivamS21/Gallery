import React, {useEffect, useRef, useState} from 'react';
import { HTMLSelect } from "@blueprintjs/core";
import './Filter.css';
import "@blueprintjs/core/lib/css/blueprint.css";
import Worker from "./Filter.worker.js";
import {FILTER_OPTION, FORM_OPTION} from "./enums";
import Button from '@material-ui/core/Button';

import {
    
    selectImg,
    setSelectedImg,
  } from "../../features/userSlice";
  import { useSelector, useDispatch } from "react-redux";

function FilImg({ setOpen}) {
    const SelectedImg = useSelector(selectImg);
    const dispatch = useDispatch();
    const INITIAL_FILENAME_STATE = "Choose file...";
    // web worker is not natively supported in a CRA (create-react-app)
    // work-around: https://medium.com/@danilog1905/how-to-use-web-workers-with-react-create-app-and-not-ejecting-in-the-attempt-3718d2a1166b
    const worker = new Worker();

    // references to element on page
    const inputRef = useRef(null);
    const canvasRef = useRef(null);
    const selectRef = useRef(null);

    // component state
    const [fileName, setFileName] = useState(INITIAL_FILENAME_STATE);
    const [imageData, setImageData] = useState(null);
    const [currentFilterOption, setCurrentFilterOption] = useState(FILTER_OPTION.NONE);
    const [downloadLink, setDownloadLink] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    console.log(fileName, isLoaded);
    /**
     * @desc Whenever the current filter changes,
     * AND imageData exists, execute the following:
     *  - filter the image data by the current filter
     *    in a separate thread
     *  - clear the canvas
     *  - draw the new filtered image onto canvas
     *  - update the download link to reflect the new canvas
     */
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (imageData === null) return; // image not yet uploaded
        worker.postMessage({currentFilterOption, imageData});
        worker.addEventListener("message", ({data}) => {
            clearCanvas();
            // draw new filtered image starting from top left corner
            context.putImageData(data, 0, 0);
            setDownloadLink(canvas.toDataURL());
        });
    }, [currentFilterOption, imageData, worker]);

    /**
     * @desc Draws a blank rect onto the canvas
     * to erase the current image.
     */
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const {width, height} = canvas;
        const context = canvas.getContext("2d");
        context.clearRect(0,0, width, height);
    };

    /**
     * @param e - event triggered from onchange
     * @desc Execute code based on the formOption
     * which triggered the event.
     */
    const handleOnChange = e => {
        const {formOption} = e.target.dataset;
        switch (formOption) {
            case FORM_OPTION.SELECT:
                const {value: filterOption} = e.target;
                setCurrentFilterOption(filterOption);
                break;
            default:
                break;
        }
    };

    /**
     * @param file - file to read
     * @param callback - callback to call after file read
     * @desc Read file as data URL and calls callback with result.
     * Updates the current filename.
     */
    function readFileAsDataUrl(file, callback) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            // console.log("file"+fileReader.result)
            callback(fileReader.result)
        });
        setFileName(file.name);
        //console.log(fileName);
        //console.log(isLoaded);
        fileReader.readAsDataURL(file);
    }

    /**
     * @param src - new image src
     * @desc Given an image src, draw a new image on canvas.
     */
    function drawImageOnCanvas(src) {
        // console.log(src)
        const img = new Image();
        img.setAttribute("src", src);
        setDownloadLink(src);
        img.addEventListener("load", () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            const {width, height} = img;
            const aspectRatio = height/width;
            // adjust canvas's dimensions
            canvas.height = canvas.width * aspectRatio;
            // draw final img in top left corner of canvas
            context.drawImage(img, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
            // update the current filter option accordingly
            selectRef.current.value = FILTER_OPTION.NONE;
            // store imageData for filtering logic
            setImageData(context.getImageData(0,0, canvas.width, canvas.height));
        });
    }
    
    /**
     * @desc Only render the download button
     * if the downloadLink is truthy.
     */
    const renderDownloadButton = () => {
        if (downloadLink) {
            return (
                <a href={downloadLink} download>
                   <Button autoFocus variant="contained" color="secondary" className="download-btn"
                        >
                    Download
                    </Button>
                      
                
                </a>
            );
        }
    };
    function handleSave(){
        if (downloadLink) {
            // console.log(downloadLink)
            dispatch(setSelectedImg(downloadLink));
        }
    }
    const handleClose = () => {
        setOpen(false);
      };

    function multiTaskSave(){
        handleSave();
        handleClose();
        }

    useEffect(() => {
        (async()=>{
           
        drawImageOnCanvas(SelectedImg)
        setLoaded(true) 
        })()
         
    }, [SelectedImg])
    
    return (
        <div className="filter">
            <main>
                <div className="options">
                    <HTMLSelect
                        // iconProps={{icon: IconNames.FILTER_LIST}}
                        data-form-option={FORM_OPTION.SELECT}
                        text={currentFilterOption}
                        className={"select"}
                        onChange={handleOnChange}
                        elementRef={selectRef}>
                        {
                            Object.values(FILTER_OPTION)
                                .map(value => <option key={value} value={value}>{value}</option>)
                        }
                    </HTMLSelect>
                    <Button autoFocus variant="contained" color="secondary" onClick={multiTaskSave}> Save</Button>
                    {renderDownloadButton()}

                </div>
                <canvas ref={canvasRef} width="400" height="400"/>
            </main>
        </div>
    );
}
export default FilImg;
