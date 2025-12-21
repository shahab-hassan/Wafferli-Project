import { useState, useEffect } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
import JoditEditor from 'jodit-react';
import Loader from '../utils/Loader';

function AdminTermsPolicy() {
    const [terms, setTerms] = useState("");
    const [privacyPolicy, setPrivacyPolicy] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('terms');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/settings/terms-privacy`);
            if (data.success) {
                setTerms(data.terms || "");
                setPrivacyPolicy(data.privacyPolicy || "");
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error || "Failed to fetch data", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const token = localStorage.getItem('adminToken');

    const joditConfig = {
        readonly: false,
        placeholder: `Enter ${activeTab === 'terms' ? 'terms & conditions' : 'privacy policy'}`,
        height: 500,
        uploader: {
            url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/blog/upload-media`,
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

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/settings/terms-privacy`,
                { terms, privacyPolicy },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                enqueueSnackbar('Updated successfully!', { variant: "success" });
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error || "Something went wrong!", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !terms && !privacyPolicy) {
        return <Loader type="checkmate" />;
    }

    return (
        <>
            {isLoading && <Loader type="checkmate" />}
            <div className='adminTermsDiv'>
                <div className="adminTermsContent">
                    <div className="form">
                        <h2 className='secondaryHeading'><span>Terms</span> & <span>Policy</span></h2>
                        <div className="horizontalLine"></div>

                        {/* Tab Navigation */}
                        <div className="tabsDiv" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                            <button
                                className={activeTab === 'terms' ? 'primaryBtn' : 'secondaryBtn'}
                                onClick={() => setActiveTab('terms')}
                                disabled={isLoading}
                            >
                                Terms & Conditions
                            </button>
                            <button
                                className={activeTab === 'privacy' ? 'primaryBtn' : 'secondaryBtn'}
                                onClick={() => setActiveTab('privacy')}
                                disabled={isLoading}
                            >
                                Privacy Policy
                            </button>
                        </div>

                        {/* Editor */}
                        {activeTab === 'terms' ? (
                            <JoditEditor
                                value={terms}
                                config={joditConfig}
                                onBlur={newContent => setTerms(newContent)}
                                onChange={() => { }}
                            />
                        ) : (
                            <JoditEditor
                                value={privacyPolicy}
                                config={joditConfig}
                                onBlur={newContent => setPrivacyPolicy(newContent)}
                                onChange={() => { }}
                            />
                        )}

                        <button className='primaryBtn' onClick={handleSave} disabled={isLoading} style={{ marginTop: '20px' }}>
                            Save All Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminTermsPolicy;