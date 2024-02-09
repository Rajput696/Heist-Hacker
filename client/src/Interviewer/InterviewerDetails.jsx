import { TextField } from '@mui/material';
import React from 'react';
import "./interViewerDetails.css"

export default function InterviewerDetails() {
    return (
        <div className='InterViewerDetails' >
            <div className="detailsFeild">
                <textarea className='text'></textarea>
                <TextField
                    className='inputFeild'
                    id="outlined-basic2"
                    label="Describe Yourself"
                    name='breif'
                    variant="standard"
                    onChange={(e) => console.log(e.target.value)} />
            </div>
        </div>
    )
}
