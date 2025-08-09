import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase_client'
import useSession from '../hooks/useSession';

const Reports = () => {

    const { session, isLoading } = useSession();
    const userId = session?.user?.id;
    const [reports, setReports] = useState([])
    const [reportData, setReportData] = useState([])
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        const get_all_reports = async () => {
            if (session && !isLoading) {
                const { data: reports, error: reportsError } = await supabase.from("reports").select("*").eq('user_id', userId).order("upload_time", { ascending: false })

                if (reportsError) {
                    console.log(reportsError);
                    return;
                }

                console.log(reports);
                setReports(reports);

                // const { data: profileData, error: errorProfile } = await supabase.from('profiles').select("*").eq("id", userId)

                // if (errorProfile) {
                //     console.log(errorProfile);
                //     return;
                // }

                // console.log(profileData);
                // setProfileData(profileData);
            }
        }
        get_all_reports();
    }, [session, isLoading])

    const handleClick = async (e, report_name) => {
        e.preventDefault();
        console.log("clicked!");

        const { data: report_Data, error: errorReport } = await supabase.from('test_results').select("*").eq("report_name", report_name)

        if (errorReport)
        {
            console.log(errorReport);
            return;
        }

        console.log(report_Data);
        setReportData(report_Data);

        setClicked(true);
    }

    const removeClick = (e) => {
        e.preventDefault();
        setClicked(false);
    }

    const handleDelete()

    return (
        <>
            {clicked && (
            <div className='fixed inset-0 flex justify-center items-center bg-black/80 z-50'>
                <div className='bg-zinc-100 p-7 rounded w-full max-w-4xl max-h-[80vh] overflow-y-auto m-6'>
                <div className='w-full mb-5 flex justify-end text-2xl cursor-pointer' 
                onClick={(e) => {removeClick(e)}} ><i class="ri-close-large-line fixed"></i></div>
                <div className='shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 my-3 p-5 rounded grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {reportData.map((tests, index) => (
                    <div key={index} className='mb-4'>
                        <h2 className="text-xl mb-2">{tests.test_name}</h2>
                        <p><span className='text-[#2563eb]'>Result:</span> {tests.test_value} {tests.unit}</p>
                        <p><span className='text-[#2563eb]'>Status:</span> {tests.test_status}</p>
                        <p><span className='text-[#2563eb]'>Normal Range:</span> {tests.reference_range}</p>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            )}

            <div className='text-4xl mt-10 my-5'>Reports</div>
            <div className='bg-gray-50 p-6 rounded-xl shadow-inner'>
                {reports.map((report, index) => (
                    <div key={report.id} className='border my-4 rounded shadow-md transition-all hover:shadow-lg hover:scale-[1.02] border-gray-200' onClick={(e) => {
                        handleClick(e, report.report_name);
                    }}>
                        <div className="mb-4 p-4 rounded cursor-pointer flex justify-between items-center">
                            <div>
                            <h3 className="font-semibold">{report.report_name}</h3>
                            <p className="text-sm text-gray-500">
                                Uploaded: {new Date(report.upload_time).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                Language: {(report.text_language)}
                            </p>
                            </div>
                            <div className='text-xl text-red-500' onClick={(e) => {

                            }}>
                                <i class="ri-delete-bin-6-line"></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Reports