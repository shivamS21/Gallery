import React, {useEffect, useRef, useState} from 'react';
// import { IconNames } from "@blueprintjs/icons";
import { Button, Intent, HTMLSelect } from "@blueprintjs/core";
import './App.css';
import "@blueprintjs/core/lib/css/blueprint.css";
// import * as Worker from "./worker";
import Worker from "./Filter.worker.js";
import {FILTER_OPTION, FORM_OPTION} from "./enums";

     function FilImg() {
   
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
    }, [currentFilterOption]);

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
            case FORM_OPTION.INPUT:
                const {files} = inputRef.current;
                if (files && files[0]) {
                    readFileAsDataUrl(files[0], drawImageOnCanvas);
                }
                break;
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
        fileReader.readAsDataURL(file);
    }

    /**
     * @param src - new image src
     * @desc Given an image src, draw a new image on canvas.
     */
    function drawImageOnCanvas(src) {
        console.log(src)
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
                    <button   className="download-btn"
                        // rightIcon={IconNames.DOWNLOAD}
                        // intent={Intent.PRIMARY}
                        >
                    Download
                    </button>
                      
                
                </a>
            );
        }
    };
    function getBase64Image(imgUrl, callback) {
        // console.log(imgUrl)
        var img = new Image();
    
        // onload fires when the image is fully loadded, and has width and height
    
        img.onload = function(){
    
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png"),
              dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    
          callback(dataURL); // the base64 string
    
        };
    
        // set attributes and src 
        img.setAttribute('crossOrigin', 'anonymous'); //
        img.src = imgUrl;
    
    }
    
    const loadCanvas = () => {
        const url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
        getBase64Image(url, function(base64image){

            // console.log(base64image);
            drawImageOnCanvas("data:image/png;base64,"+base64image)
            setLoaded(true)
       });
            
    }

    useEffect(() => {
        loadCanvas() 
    }, [])
    
    return (
        <div className="app">
            <main>
                 {/* <Button onClick={loadCanvas}> Image Edit</Button> */}
                {/* {isLoaded?  <canvas ref={canvasRef} width="400" height="400"/>
                :""}  */}
           
                <div className="options">
                    {/* <label className="bp3-file-input">
                        <input
                            type={"file"}
                            accept="image/png, image/jpeg"
                            data-form-option={FORM_OPTION.INPUT}
                            ref={inputRef}
                            onChange={handleOnChange}/>
                        <span className="bp3-file-upload-input">{fileName}</span>
                    </label> */}
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
                    {renderDownloadButton()}

                </div>
                <canvas ref={canvasRef} width="400" height="400"/>
            </main>
        </div>
    );
}
export default FilImg;
