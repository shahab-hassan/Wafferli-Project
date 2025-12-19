// USING JODIT EDITOR

import { useState, useEffect } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
import JoditEditor from 'jodit-react';

function AdminTerms() {
    const [terms, setTerms] = useState("");

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/settings/admin/terms`)
            .then(res => {
                if (res.data.success) {
                    setTerms(res.data?.terms || "");
                }
            })
    }, []);

    const token = localStorage.getItem('adminToken');

    const joditConfig = {
        readonly: false,
        placeholder: 'Enter terms & conditions',
        height: 500,
        uploader: {
            url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/faq/upload-media`, // Reuse FAQ upload endpoint for consistency
            headers: { Authorization: `Bearer ${token}` },
            format: 'json',
            insertImageAsBase64URI: false,
            imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
            filesVariableName: function (t) { return 'media'; },
            withCredentials: false,
            pathVariableName: 'path',
            isSuccess: function (resp) {
                return resp.success;
            },
            process: function (resp) {
                return { files: [resp.url] };
            },
            defaultHandlerSuccess: function (data, resp) {
                this.selection.insertImage(data.files[0]);
            },
            error: function (e) {
                enqueueSnackbar('Upload failed', { variant: 'error' });
            }
        },
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'video', 'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'fullsize', 'selectall', 'print'
        ],
        removeButtons: ['file', 'source']
    };

    const handleSave = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/settings/admin/terms`, { content: terms }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (res.data.success) {
                    enqueueSnackbar('Terms & conditions updated successfully!', { variant: "success" });
                }
            })
            .catch(e => {
                enqueueSnackbar(e?.response?.data?.error || "Something went wrong!", { variant: "error" });
            });
    };

    return (
        <div className='adminTermsDiv'>
            <div className="adminTermsContent">
                <div className="form">
                    <h2 className='secondaryHeading'><span>Terms</span> & <span>Conditions</span></h2>
                    <div className="horizontalLine"></div>
                    <JoditEditor
                        value={terms}
                        config={joditConfig}
                        onBlur={newContent => setTerms(newContent)}
                        onChange={() => { }}
                    />
                    <button className='primaryBtn' onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default AdminTerms;























// USING REACT QUILL

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { enqueueSnackbar } from "notistack";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// function AdminTerms() {
//     const [terms, setTerms] = useState("");

//     useEffect(() => {
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/settings/admin/terms`)
//             .then(res => {
//                 if (res.data.success) {
//                     setTerms(res.data?.terms || "");
//                 }
//             })
//     }, []);

//     const handleSave = () => {
//         const token = localStorage.getItem('adminToken');
//         axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/settings/admin/terms`, { content: terms }, {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//             .then(res => {
//                 if (res.data.success) {
//                     enqueueSnackbar('Terms & conditions updated successfully!', { variant: "success" });
//                 }
//             })
//             .catch(e => {
//                 enqueueSnackbar(e?.response?.data?.error || "Something went wrong!", { variant: "error" });
//             });
//     };

//     return (
//         <div className='adminTermsDiv'>
//             <div className="adminTermsContent">
//                 <div className="form">
//                     <h2 className='secondaryHeading'><span>Terms</span> & <span>Conditions</span></h2>
//                     <div className="horizontalLine"></div>
//                     <ReactQuill
//                         value={terms}
//                         onChange={(value) => setTerms(value)}
//                         theme="snow"
//                         className='reactQuill'
//                     />
//                     <button className='primaryBtn' onClick={handleSave}>Save</button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AdminTerms;
