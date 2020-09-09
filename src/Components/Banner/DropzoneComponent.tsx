import React, {useContext, useEffect, useState} from 'react';
import {DropzoneState, useDropzone} from "react-dropzone";
import SS from "@saraceninc/saracen-style-ts";
import styled from "styled-components";
import Context from "../../Context/context";

interface DropProps {
    exist?: boolean
    app?: boolean
    uploadHeight?: string
}

const Inner = styled(SS.Core.Inner)`
padding : 5px 5px 5px 5px;
`;
const Drop = styled.div<DropProps>`
    width: 100%;
    height: 100%;
    border: 1px solid #e2e2e2;
    position: relative;
        &::before {
          content:  "";
          position: absolute;
          ${props => props.exist ? "width : 0" : "width : 6px"};
          height : 40px;
          left : 50%;
          top : 50%;
          border-radius: 5px;
          transform: translate(-50%,-50%);
          background-color: #3f51b5;
        }
        &::after {
          content:  "";
          position: absolute;
          width : 40px;
          ${props => props.exist ? "height : 0" : "height : 6px"};
          left : 50%;
          top : 50%;
          border-radius: 5px;
          transform: translate(-50%,-50%);
          background-color: #3f51b5;
        }
`;
const Preview = styled.div<DropProps>`
    display: flex;
    width :100%;
    min-height : ${props => props.uploadHeight};
    position: relative;
    &::before{
    content : "";
    z-index: ${props => !props.exist ? "1" : "-1"};
    position : absolute;
    top: 30%;
    left : 50%;
    font-weight: bold;
    color : #3f51b5;
    transform: translate(-50%,0%);
 
    }
`;

interface IProps {
    uploadHeight?: string
    pathname?: string
}

interface FileProps extends File {
    preview: string | undefined
}

const DropzoneComponent: React.FunctionComponent<IProps> = ({uploadHeight}) => {

    const {
        files, setFiles, setFilename, setReserveCheck, pathname
    } = useContext(Context)

    const {getRootProps, getInputProps, acceptedFiles}: DropzoneState = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles: any) => {
            setFiles(acceptedFiles.map((file: FileProps) => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumbs = files.map((file: FileProps) => (
        <div style={{overflow: "auto", height: "100%", width: "100%"}} key={file.name}>
            {
                file.preview ? <img style={{maxWidth: "100%"}}
                                    src={file?.preview}
                /> : <></>
            }
        </div>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks
        console.log(files)
        if (files.length > 0) {
            const image = document.querySelector("#image") as any
            setTimeout(() => {
                image.dispatchEvent(new Event("blur", {bubbles: false}))
            }, [500])
            files.forEach((file: FileProps) => {
                setFilename(file.name);
            });

        }

    }, [files]);

    useEffect(() => {
        if (files.length > 0) {
            files.map((file: any) => {
                URL.revokeObjectURL(file.preview as string)
                delete file.preview;
            })
            setFilename("");
            setReserveCheck(false)
            setFiles([]);
            console.log(files, "-----여기는 pathname useEffect", pathname)
        }

    }, [pathname])


    return (
        <Inner className="container">
            <Drop {...getRootProps({className: 'dropzone'})} exist={acceptedFiles.length > 0 ? true : false}>
                <input {...getInputProps()} />
                <Preview exist={acceptedFiles.length > 0 ? true : false} uploadHeight={uploadHeight}>
                    {thumbs}
                </Preview>
            </Drop>

        </Inner>
    );
}
export default DropzoneComponent;