import axios from "axios";
import { useEffect, useState } from "react";
import {BsXLg,BsCloudDownload, BsClipboard, BsCheckLg} from "react-icons/bs"

function ConfigPreview({name, path, configfile}) {
    const [isVisible,setIsVisible] = useState(false)
    const [config, setConfig] = useState(null);
    const [copyconfig, setCopyConfig] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [masterkey, setMasterkey] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [inputValues, setInputValues] = useState([]);
    const [mastervalue, setMastervalue] = useState(null);
    const [fileparams, setFileparams] = useState({background:"/misccode.png",icon:"/document.png"});
    useEffect(()=>{
      if (configfile.endsWith(".sh")){
        setFileparams({background:"/bashcode.png",icon:"/shell.png"});
      }
      else if(configfile.includes("docker")){
        setFileparams({background:"/dockercode.png",icon:"/docker.png"});
      }
    },[])
    
    

    const handleInputChange = (index, event) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = event.target.value;
        setInputValues(newInputValues);
        
        const hashesCount = (copyconfig.match(/#####/g) || []).length;
        const values = newInputValues.slice(0, hashesCount);
        setConfig(copyconfig.replace(/#####/g, () => values.shift() || "#####"));
      };
      
    function handlecopy(){
        navigator.clipboard.writeText(config);
        setIsCopied(true);
    }

  useEffect(() => {
    if (isVisible){
        getConfig2();
    }
  }, [isVisible]);

  function handleClose(){
    setIsCopied(false);
    setIsVisible(false);

  }

  const handleDownload = () => {
    const content = config;
    const filename = fileName;
    const contentType = "text/plain";
  
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(url);
  }
  

  function getConfig2(){
    axios.get("/data/"+path).then((response)=>{
        axios.get("/data/"+response.data.config_path).then((res)=>{
            setFileName(response.data.config_path)
            setInputs(response.data.input)
            setMasterkey(response.data.master_key)
            console.log(res.data)
            setConfig(res.data);
            setCopyConfig(res.data);
        })
    })
  }

    return ( 
        <>
        <div className="w-56 flex flex-col items-center cursor-pointer shadow-sm hover:scale-100 transition-all" onClick={()=>{setIsVisible(true)}}>
            <div className="w-56 h-80 bg-white rounded-lg 
            border-solid border-gray-200 shadow-md border-[1px]
            hover:border-none hover:shadow-lg
            relative flex justify-center items-center group">
              <img src={fileparams.background} className="absolute group-hover:blur-sm inset-0 object-cover rounded-lg h-80 transition-all" alt="pic" />
              <img src={fileparams.icon} className="top-1/2 opacity-0 group-hover:opacity-100 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all absolute inset-0 object-cover rounded-lg h-36" alt="pics" />
            </div>
            <p className="text-sm text-gray-500 mt-2">{name}</p>
        </div>
        {/* modal */}
        {isVisible &&
        <div className=" relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="w-11/12 relative transform flex items-center flex-col overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
              { /* Modal content */ }
              <div onClick={()=>{handleClose()}} className="z-10 cursor-pointer absolute w-8 h-8 bg-gray-300 rounded-full right-2 top-2 flex items-center justify-center" >
              <BsXLg color="#666" size={18} />
              </div>
               {/* pic */}
               <div className="w-full relative h-[90vh] flex flex-row">
                {/* input panel */}
                <div className="w-1/2 p-4 h-full flex flex-col gap-4 ">
                    <p>inputs:</p>
                    {masterkey && masterkey.value && 
                      <div>
                      <p className="text-sm mb-1 text-gray-500">configuration type</p>
                      <select
                          className="h-8 w-full bg-white rounded-md px-2 border-[1px]"
                          value={mastervalue}
                          onChange={(event) => setMastervalue(event.target.value)}>
                                <option disabled value="">---</option>
                                {masterkey.options.map((value, i) => (
                                  <option key={i} value={value.key}>
                                    {value.name}
                                  </option>
                                ))}
                      </select>
                      </div>
                    }
                    {inputs && inputs.map((input,index)=>{
                        if (input.type==="text")
                         return(
                            <div className="" key={index}>
                            <p className="text-sm mb-1 text-gray-500">{input.name}</p>
                            <input value={inputValues[index] || ""}
                            onChange={(event) => handleInputChange(index, event)} className="h-8 w-full rounded-md px-2 border-[1px] " />
                            </div>
                        )
                        else{
                            return(
                                <div className="" key={index}>
                                    <p className="text-sm mb-1 text-gray-500">{input.name}</p>
                                    <select
                                        className="h-8 w-full bg-white rounded-md px-2 border-[1px]"
                                        value={inputValues[index] || ""}
                                        onChange={(event) => handleInputChange(index, event)}
                                    >
                                        <option disabled value="">---</option>
                                        {input.values.map((value, i) => (
                                        <option key={i} value={value.real_value}>
                                            {value.name}
                                        </option>
                                        ))}
                                    </select>
                                    </div>

                            )
                        }
                    })}
                    
                </div>
                {/* preview panel */}
                <div  className="w-1/2 h-[90%] flex items-center justify-center flex-col">
                    <div className="w-full h-full flex ">
                        <textarea className="w-full mx-8 mt-12 h-[90%] resize-none rounded-md p-2 text-gray-500 border-[1px] border-gray-300" readOnly value={config} />
                    </div>
                    <div className="h-8 w-full mt-6 flex flex-row items-center gap-8 justify-center">
                        <div onClick={()=>{handleDownload()}} className=" flex justify-center items-center  h-12 w-12 bg-[#bdd248] cursor-pointer rounded-full hover:opacity-70 transition-all"><BsCloudDownload size={20} fill={"#fff"} /></div>
                        <div onClick={() => {handlecopy()}} className=" flex cursor-pointer justify-center items-center  h-12 w-12 bg-[#bdd248] rounded-full hover:opacity-70 transition-all">{isCopied?<BsCheckLg  size={24} fill={"#fff"} />:<BsClipboard size={20} fill={"#fff"} />}</div>
                        
                    </div>
                </div>
                    
               </div>
                {/* Info grid */}
                
                
                
                </div>
          </div>
        </div>
      </div> }
        
        </>
     );
}

export default ConfigPreview;