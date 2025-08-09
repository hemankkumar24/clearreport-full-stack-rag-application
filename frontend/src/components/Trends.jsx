import React, { useEffect, useState } from 'react'
import useSession from '../hooks/useSession';
import { isSession } from 'react-router-dom';
import { supabase } from '../supabase_client';
import LineGraph from './LineGraph';

const Trends = () => {
  const { session, isLoading } = useSession();
  const userId = session?.user?.id;
  const [glucoseLabels, setGlucoseLabels] = useState([]);
  const [glucoseValues, setGlucoseValues] = useState([]);
  const [hemoLabels, setHemoLabels] = useState([]);
  const [hemoValues, setHemoValues] = useState([]);

  useEffect(() => {
    const get_graphs = async () => {
      if (!isLoading && session) {
        const { data: glucose, error: glucoseError } = await supabase.from("test_results").select("*").ilike('test_name', '%glucose%').eq('report_id', userId).order("id", { ascending: true });
        if (glucoseError) { console.log(glucoseError) }

        const { data: hemoglobin, error: hemoglobinError } = await supabase.from("test_results").select("*").ilike('test_name', '%hemoglobin%').eq('report_id', userId).order("id", { ascending: true });
        if (hemoglobinError) { console.log(hemoglobinError) }

        console.log(hemoglobin);
        console.log(glucose);

        var arr = [];
        var arr_values = [];

        glucose.forEach((entry) => {
          const report_name = entry.report_name;
          if (!(arr.includes(report_name))) {
            arr.push(report_name);
            arr_values.push(entry.test_value);
          }
        })

        console.log(arr_values)
        setGlucoseLabels(arr);
        setGlucoseValues(arr_values);

        var arr = [];
        var arr_values = [];

        hemoglobin.forEach((entry) => {
          const report_name = entry.report_name;
          if (!(arr.includes(report_name))) {
            arr.push(report_name);
            arr_values.push(entry.test_value);
          }
        })

        console.log(arr_values);
        setHemoLabels(arr);
        setHemoValues(arr_values);

      }
    };
    get_graphs();
  }, [session, isLoading]
  )

  return (
    <>
      <div className='text-4xl mt-10'>Trends Over Time</div>
      <div className='bg-gray-50 p-6 rounded-xl shadow-inner my-5'>
        <div className='my-15'>
          <LineGraph
            labels={glucoseLabels}
            values={glucoseValues}
            labelName="Glucose"
            lineColor="#34d399"
          />
        </div>
        <div className='my-15'>
          <LineGraph
            labels={hemoLabels}
            values={hemoValues}
            labelName="Glucose"
            lineColor="#f87171"
          />
        </div>
      </div>
    </>
  )
}

export default Trends