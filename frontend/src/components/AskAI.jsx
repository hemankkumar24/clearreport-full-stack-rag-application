import React, { useEffect, useState } from 'react'
import useSession from '../hooks/useSession'
import { supabase } from '../supabase_client'

const AskAI = () => {
  const [textBar, setTextBar] = useState("")
  const [text, setText] = useState("")
  const [headerText, setHeaderText] = useState("")
  const [showText, setShowText] = useState([])
  const [numberHandler, setNumberHandler] = useState(0);
  const { session, isLoading } = useSession();
  const userId = session?.user?.id;
  const [profileData, setProfileData] = useState("")

  useEffect(() => {
    const get_profile_data = async () => {
      if (session && !isLoading) {
        const { data: profile_Data, error: errorProfile } = await supabase.from('profiles').select("*").eq("id", userId).single()

        if (errorProfile) {
          console.log(errorProfile);
          return;
        }

        console.log(profile_Data);
        setProfileData(profile_Data);
      }


    }
    get_profile_data();
  }, [session, isLoading]
  )




  const handleShowText = (text) => {
    if (!text.trim()) return;
    console.log("ho")
    const newMessage = {
      id: Date.now(),
      content: text,
      align: numberHandler % 2 === 0 ? 'right' : 'left'
    };

    setShowText((prev) => [...prev, newMessage]);
    setNumberHandler((prev) => prev + 1);
  }

  const handleText = (e) => {
    e.preventDefault();
    setText(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setTextBar("transition-transform duration-500 ease-in-out translate-y-90");
    setHeaderText("transition-all duration-200 ease-in-out -translate-y-5 opacity-0");
    console.log(text);
    setText('');

    handleShowText(text);
  }

  return (
    <>
      <div className='text-4xl mt-10'>Ask anything regarding your reports!</div>
      <div className="relative w-full h-[80vh] bg-gray-50 p-6 rounded-xl shadow-inner my-5 overflow-hidden">

        <form onSubmit={handleSubmit} className="h-full">

          <div className="w-full h-full overflow-y-auto flex flex-col gap-2 pb-[70px] px-4 pt-4">

            {showText.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.align === 'left' ? 'justify-start' : 'justify-end'
                  }`}
              >
                <div className={`px-4 py-2 max-w-[70%] w-[50%]${msg.align === 'left' ? 'ml-20 text-xl text-black' : 'mr-20  text-white bg-zinc-600 rounded-l-full rounded-b-full text-right text-xl'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>


          <div className={`absolute bottom-[30.00rem] left w-full text-center mx-auto text-black ${headerText} text-3xl`}>Ask me anything! {profileData?.full_name || 'there'}</div>
          <input
            type="text"
            value={text}
            onChange={(e) => { handleText(e) }}
            className={`absolute bottom-1/2 left-1/2 -translate-x-1/2 w-full h-[50px] bg-gray-200 shadow-md focus:shadow-lg transition-shadow rounded-2xl max-w-5xl mx-auto text-black text-xl p-3 ${textBar}
      focus:outline-0`}
            placeholder="Ask anything"
          />
        </form>
      </div>
    </>
  )
}

export default AskAI