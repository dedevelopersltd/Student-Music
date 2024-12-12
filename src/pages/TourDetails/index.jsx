import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "./../Layout";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegTrashAlt, FaEye } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ReactApexChart from 'react-apexcharts'
import Papa from 'papaparse';
import { FaCircleCheck } from "react-icons/fa6";


const TourDetails = () => {
  const { slug, slug2 } = useParams();
  const uploadcsv = useRef(null);
  const navigate = useNavigate();
  const [showhide, setShowhide] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [artists, setArtists] = useState([]);
  const [realartist, setRealArtist] = useState([]);
  const [tours, setTours] = useState([]);
  const [filterupcomingtours, setFilterUpcomingTours] = useState([]);
  const [filterongoingtours, setFilterOngoingTours] = useState([]);
  const [historyTour, setHistoryTour] = useState([]);
  const [edit, setEdit] = useState("");

  const [showtab, setShowTab] = useState(1)

  const [statements, setStatements] = useState([])
  const [tasks, setTasks] = useState([])
  const [taxes, setTaxes] = useState([])
  const [contracts, setContracts] = useState([])
  const [statementname, setStatementName] =  useState("")
  const [statementlink, setStatementLink] = useState("")
  const [countrytax, setCountryTax] = useState("")
  const [datetax, setDateTax] = useState("")
  const [income, setIncome] = useState("")
  const [datetour, setDateTour] = useState("")

  const [payment, setPayment] = useState("")
  const [peoplecountry, setPeopleCountry] = useState("")
  const [tripcountry, setTripCountry] = useState("")
  const [peopleoversea, setPeopleOversea] = useState("")
  const [tripoversea, setTripOversea] = useState("")
  const [othernotes, setOtherNotes] = useState("")

  const [requiredbalance, setRequiredBalance] = useState("")

  const [liability, setLiability] = useState({"text": "Coverred by Current PLI Turnover policy?", notes: ""})
  const [insurance, setInsurance] = useState({"text": "Covered by current Travel Insurance period?", notes: ""})
  const [equipment, setEquipment] = useState({"text": "Covered by current Equipment Insurance period?", notes: ""})
  const [workcover, setWorkCover] = useState({"text": "Workcover in place for contractors? - NSW", notes: ""})


  useEffect(() => {
    const storedArtistsaa = JSON.parse(localStorage.getItem(slug)) || [];
    const artistIndex = storedArtistsaa.findIndex(
      (artist) => Number(artist.id) === Number(slug2)
    );
    if (artistIndex !== -1) {
      setArtists(storedArtistsaa[artistIndex]);
    }

    const artistdata = JSON.parse(localStorage.getItem("artists")) || [];
    const artistfindIndex = artistdata.findIndex(
      (artist) => Number(artist.id) === Number(slug)
    );
    if (artistfindIndex !== -1) {
      // console.log("realartist", realartist);
      setRealArtist(artistdata[artistIndex]);
    }

    // STATEMENT JSON DATA
    const statementdata = JSON.parse(localStorage.getItem("statement_"+slug2)) || [];
    setStatements(statementdata);

    // TASKS JSON DATA
    const tasksdata = JSON.parse(localStorage.getItem("tasks_"+slug2)) || [];
    setTasks(tasksdata);

    // TAXES JSON DATA
    const taxesdata = JSON.parse(localStorage.getItem("tax_"+slug2)) || [];
    setTaxes(taxesdata);

     // CONTRACTORS JSON DATA
     const contractdata = JSON.parse(localStorage.getItem("contract_"+slug2)) || [];
     setContracts(contractdata);

     // GET BALANCE OF THIS EVENT
     const evantbalance = (localStorage.getItem(slug2+"_balance")) || [];
     setRequiredBalance(evantbalance)

     // GET LIABILITY OF THIS EVENT
     const eventliability = JSON.parse(localStorage.getItem(slug2+"_liability")) || liability;
     setLiability(eventliability)

     // GET INSURANCE OF THIS EVENT
     const eventinsurance = JSON.parse(localStorage.getItem(slug2+"_insurance")) || insurance;
     setInsurance(eventinsurance)

     // GET EQUIPMENT OF THIS EVENT
     const eventequipment = JSON.parse(localStorage.getItem(slug2+"_equipment")) || equipment;
     setEquipment(eventequipment)

      // GET WORK COVER OF THIS EVENT
      const eventcover = JSON.parse(localStorage.getItem(slug2+"_cover")) || workcover;
      setWorkCover(eventcover)

  }, []);

  // MANAGE STATMENT DATA
  useEffect(() => {
    localStorage.setItem("statement_"+slug2, JSON.stringify(statements));
  }, [statements]);

  // MANAGE TASJS DATA
  useEffect(() => {
    localStorage.setItem("tasks_"+slug2, JSON.stringify(tasks));
  }, [tasks]);

   // MANAGE TAXES DATA
   useEffect(() => {
    localStorage.setItem("tax_"+slug2, JSON.stringify(taxes));
  }, [taxes]);

  // MANAGE CONTRACTORS DATA
  useEffect(() => {
    localStorage.setItem("contract_"+slug2, JSON.stringify(contracts));
  }, [contracts]);



  useEffect(() => {
    // localStorage.setItem(slug, JSON.stringify(tours));
  }, [tours]);


  const do_save_statement = async (e) => {
    e.preventDefault();

    if (statementname == "") {
      toast.error("Please enter Statement");
      return;
    }
    if (statementlink == "") {
      toast.error("Please enter Statement Links");
      return;
    }
    if (edit === "") {
        const uniqueID = Date.now();
        const newTour = {
          id: uniqueID,
          name: statementname,
          link: statementlink,
          status: 1,
        };
        setStatements((prevArtists) => [...prevArtists, newTour]);
        setShowhide(false);
        setStatementName("")
        setStatementLink("")
        toast.success("Statement information added successfully");
    } else {
      const updatedArtists = [...tours]; 
      updatedArtists[edit].name = tourname;
      updatedArtists[edit].place = place;
      updatedArtists[edit].income = income;
      updatedArtists[edit].date = datetour;
      setTours(updatedArtists);
      toast.success("Tour information updated successfully");
    }
  };

  const changeStatementStatus = (e, id) => {
    const updatedStatements = statements.map((statement) => {
      if (statement.id === id) {
        return { ...statement, status: e.target.checked ? 1 : 0 }; // Update status based on checkbox state
      }
      return statement;
    });
    toast.success("status information updated successfully!")
    setStatements(updatedStatements);
  };

  // TASKS NOTES TAB 5
  const do_save_tasks = async (e) => {
    e.preventDefault();

    if (statementname == "") {
      toast.error("Please enter Task");
      return;
    }
    if (statementlink == "") {
      toast.error("Please enter Link");
      return;
    }
        const uniqueID = Date.now();
        const newTour = {
          id: uniqueID,
          name: statementname,
          link: statementlink,
          status: 1,
        };
        setTasks((prevArtists) => [...prevArtists, newTour]);
        setShowhide(false);
        setStatementName("")
        setStatementLink("")
        toast.success("Task information added successfully");
  };

  const changeTaskStatus = (e, id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, status: e.target.value };
      }
      return task;
    });
    toast.success("status information updated successfully!")
    setTasks(updatedTasks);
  };

   // TASKS TAX TAB 2
   const do_save_tax = async (e) => {
    e.preventDefault();
    if (countrytax == "") {
      toast.error("Please enter Country");
      return;
    }
    if (statementname == "") {
      toast.error("Please enter Task");
      return;
    }
    if (statementlink == "") {
      toast.error("Please enter Link");
      return;
    }
    if (datetax == "") {
      toast.error("Please enter Date");
      return;
    }
        const uniqueID = Date.now();
        const newTour = {
          id: uniqueID,
          name: statementname,
          link: statementlink,
          country: countrytax,
          date: datetax,
          status: 1,
        };
        setTaxes((prevArtists) => [...prevArtists, newTour]);
        setShowhide(false);
        setStatementName("")
        setStatementLink("")
        setDateTax("")
        setCountryTax("")
        toast.success("Task information added successfully");
  };
  const changeTaxStatus = (e, id) => {
    const updatedTasks = taxes.map((task) => {
      if (task.id === id) {
        return { ...task, status: e.target.value };
      }
      return task;
    });
    toast.success("status information updated successfully!")
    setTaxes(updatedTasks);
  };

     // CONTARACTORS TAB 3
  const do_save_contracts = async (e) => {
      e.preventDefault();
      if (payment == "") {
        toast.error("Please enter Payment");
        return;
      }
      if (peoplecountry == "") {
        toast.error("Please enter People in country");
        return;
      }
      if (tripcountry == "") {
        toast.error("Please enter Trip in country");
        return;
      }
      if (peopleoversea == "") {
        toast.error("Please enter People Overseas");
        return;
      }
      if (tripoversea == "") {
        toast.error("Please enter Trip Overseas");
        return;
      }
      if (othernotes == "") {
        toast.error("Please enter Other Notes");
        return;
      }
          const uniqueID = Date.now();
          const newTour = {
            id: uniqueID,
            payment: payment,
            people: peoplecountry,
            tripcountry: tripcountry,
            peopleoversea: peopleoversea,
            tripoversea: tripoversea,
            notes: othernotes,
          };
          setContracts((prevArtists) => [...prevArtists, newTour]);
          setShowhide(false);
          setPayment("")
          setPeopleCountry("")
          setPeopleOversea("")
          setTripCountry("")
          setTripOversea("")
          setOtherNotes("")
          toast.success("Information added successfully");
    };
  
  const handle_required_balance = async (e) => {
    setRequiredBalance(e.target.value)
    localStorage.setItem(slug2+"_balance", e.target.value)
  }

  const change_insurance_data = (value, category, key) => {
    if(category == 'liability'){
      setLiability(prevState => ({
        ...prevState,
        [key]: value, 
      }));
      localStorage.setItem(slug2+"_"+category, JSON.stringify(liability))
    }
    if(category == 'insurance'){
      setInsurance(prevState => ({
        ...prevState,
        [key]: value, 
      }));
      localStorage.setItem(slug2+"_"+category, JSON.stringify(insurance))
    }

    if(category == 'equipment'){
      setEquipment(prevState => ({
        ...prevState,
        [key]: value, 
      }));
      localStorage.setItem(slug2+"_"+category, JSON.stringify(equipment))
    }

    if(category == 'cover'){
      setWorkCover(prevState => ({
        ...prevState,
        [key]: value, 
      }));
      localStorage.setItem(slug2+"_"+category, JSON.stringify(workcover))
    }

    
  };
  

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-800 text-md font-bold uppercase">
          <span>Tour Information</span>
        </div>
      </div>

      

      <div className="flex justify-between gap-3 w-full">
            <div className="bg-[#fff] p-4 rounded-lg w-full">
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">
                        Tour Name
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Place</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Expected income</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Date</th>
                      {/* <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0] w-[150px]">
                        
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                      <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                        <td className="p-4 text-sm text-gray-800">{artists?.name}</td>
                        <td className="p-4 text-sm text-gray-800">{artists?.place}</td>
                        <td className="p-4 text-sm text-gray-800">${artists?.income}</td>
                        <td className="p-4 text-sm text-gray-800">{artists?.date}</td>
                        {/* <td className="p-4 text-sm text-gray-800">
                          
                        </td> */}
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
      </div>

      <div className="flex justify-between gap-3 w-full mt-4">
        <div className="w-2/12">
          <div className={`bg-white text-center p-4 mb-2 rounded-full px-10 hover:bg-[#787878] hover:text-white cursor-pointer 
            ${showtab==1?"!bg-[#787878] text-white":''}`} onClick={()=> setShowTab(1)}>
            Pre tour
          </div>
          <div className={`bg-white text-center p-4 mb-2 rounded-full px-10 hover:bg-[#787878] hover:text-white cursor-pointer ${showtab==2?"!bg-[#787878] text-white":''}`} onClick={()=> setShowTab(2)}>
            Tax variation
          </div>
          <div className={`bg-white text-center p-4 mb-2 rounded-full px-10 hover:bg-[#787878] hover:text-white cursor-pointer ${showtab==3?"!bg-[#787878] text-white":''}`} onClick={()=> setShowTab(3)}>
            Contractors
          </div>
          <div className={`bg-white text-center p-4 mb-2 rounded-full px-10 hover:bg-[#787878] hover:text-white cursor-pointer ${showtab==4?"!bg-[#787878] text-white":''}`} onClick={()=> setShowTab(4)}>
            Insurances
          </div>
          <div className={`bg-white text-center p-4 mb-2 rounded-full px-10 hover:bg-[#787878] hover:text-white cursor-pointer ${showtab==5?"!bg-[#787878] text-white":''}`} onClick={()=> setShowTab(5)}>
            Post tour
          </div>
        </div>
        <div className="w-10/12">
        {/* TAB 1 */}
        {
          showtab == 1 &&
            <div className="bg-[#fff] p-4 rounded-lg w-full">
               <div className="flex justify-end">
                  <button
                    onClick={() => setShowhide(!showhide)}
                    type="button"
                    className="px-5 py-2 mb-2 rounded-full text-white text-xs tracking-wider border border-current outline-none hover:bg-[#202020] bg-[#56AEFB]"
                  >
                    Add Statement
                  </button>
                </div>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">
                      Statements
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Links</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                   {
                      statements.length == 0 &&
                          <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                            <td colSpan={3} className="p-4 text-sm font-semibold text-center text-[#f00]">No Statement found!</td>
                          </tr>
                    }
                    {
                      statements?.map((item, ind) => {
                        return (
                          <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                            <td className="p-4 text-sm text-gray-800">{item?.name}</td>
                            <td className="p-4 text-sm text-gray-800"><a className="text-[#6767ff]" href={item?.link} target="_blank">{item?.link}</a></td>
                            <td className="p-4 text-sm text-gray-800">
                              <input type="checkbox" name="status" checked={item?.status == 1 ? true : false} className="mr-2" value={1} onChange={(e) => changeStatementStatus(e, item?.id)} />
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
        }
        {/* TAB 2 */}
        {
          showtab == 2 &&
            <div className="bg-[#fff] p-4 rounded-lg w-full">
               <div className="flex justify-end">
                  <button
                    onClick={() => setShowhide(!showhide)}
                    type="button"
                    className="px-5 py-2 mb-2 rounded-full text-white text-xs tracking-wider border border-current outline-none hover:bg-[#202020] bg-[#56AEFB]"
                  >
                    Add Task
                  </button>
                </div>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Country</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">
                      Task
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">
                      Date
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Links</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                   {
                      taxes.length == 0 &&
                          <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                            <td colSpan={5} className="p-4 text-sm font-semibold text-center text-[#f00]">No information found!</td>
                          </tr>
                    }
                    {
                      taxes?.map((item, ind) => {
                        return (
                          <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                            <td className="p-4 text-sm text-gray-800">{item?.country}</td>
                            <td className="p-4 text-sm text-gray-800">{item?.name}</td>
                            <td className="p-4 text-sm text-gray-800">{item?.date}</td>
                            <td className="p-4 text-sm text-gray-800"><a className="text-[#6767ff]" href={item?.link} target="_blank">{item?.link}</a></td>
                            <td className="p-4 text-sm text-gray-800">
                              <select name="status" onChange={(e) => changeTaxStatus(e, item?.id)} className="p-2 px-4 rounded-full">
                                <option value="1" selected={item?.status == 1 ? true : false} >For Review</option>
                                <option value="2" selected={item?.status == 2 ? true : false}>In Progress</option>
                                <option value="3" selected={item?.status == 3 ? true : false}>Done</option>
                              </select>
                              {/* <input type="checkbox" name="status" checked={item?.status == 1 ? true : false} className="mr-2" value={1} onChange={(e) => changeStatementStatus(e, item?.id)} /> */}
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
        }

        {/* TAB 3 */}
        {
          showtab == 3 &&
            <div className="bg-[#fff] p-4 rounded-lg w-full">
               <div className="flex justify-end">
                  <button
                    onClick={() => setShowhide(!showhide)}
                    type="button"
                    className="px-5 py-2 mb-2 rounded-full text-white text-xs tracking-wider border border-current outline-none hover:bg-[#202020] bg-[#56AEFB]"
                  >
                    Add Information
                  </button>
                </div>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-xs font-semibold text-gray-800 bg-[#f0f0f0]">Expected contractors
                      <br />payments</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-800 bg-[#f0f0f0]">
                      No. people within 
                      <br />the country
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-800 bg-[#f0f0f0]">
                      No. trips within <br />the country
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-800 bg-[#f0f0f0]">No. people <br />overseas</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-800 bg-[#f0f0f0]">No. trips <br />overseas</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-800 bg-[#f0f0f0]">Other<br />notes</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                   {
                      contracts.length == 0 &&
                          <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                            <td colSpan={6} className="p-4 text-sm font-semibold text-center text-[#f00]">No information found!</td>
                          </tr>
                    }
                    {
                      contracts?.map((item, ind) => {
                        return (
                          <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                            <td className="p-4 text-sm text-gray-800">{parseFloat(item?.payment)}</td>
                            <td className="p-4 text-sm text-gray-800">{item?.people}</td>
                            <td className="p-4 text-sm text-gray-800">{item?.tripcountry}</td>
                            <td className="p-4 text-sm text-gray-800">{item?.peopleoversea}</td>
                            <td className="p-4 text-sm text-gray-800">{item?.tripoversea}</td>
                            <td className="p-4 text-sm text-gray-800">{item?.notes}</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
        }
        {/* TAB 4 */}
        {
          showtab == 4 &&
          <>
             <div className="bg-[#fff] p-4 rounded-lg w-full">
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Start date</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">End date</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Current balance</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Required balance:</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                      <tr className="hover:bg-gray-100 bg-[#fafafa]">
                        <td className="p-4 text-sm text-gray-800">{realartist.startdate}</td>
                        <td className="p-4 text-sm text-gray-800">{realartist.enddate}</td>
                        <td className="p-4 text-sm text-gray-800">${realartist.insurance_balance}</td>
                        <td className="p-4 text-sm text-gray-800">
                          <input type="number" className="p-2 px-4 bg-[#e4e4e4]" min={0} step={0.01} value={requiredbalance} onChange={(e) => handle_required_balance(e)} />
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#fff] p-4 rounded-lg w-full mt-4">
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Public Liability Coverage</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Notes</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                      <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                        <td className="p-4 text-sm text-gray-800 w-[40%]">{liability.text}</td>
                        <td className="p-4 text-sm text-gray-800"><textarea className="border p-2 text-xs border-[#f0f0f0] w-[300px]" value={liability.notes} onChange={(e) => change_insurance_data(e.target.value, 'liability', 'notes')} /></td>
                        <td className="p-4 text-sm text-gray-800"><FaCircleCheck size={30} color={Number(realartist.insurance_balance) >= requiredbalance ? "green": "grey"} /></td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>


            <div className="bg-[#fff] p-4 rounded-lg w-full mt-4">
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Travel Insurance Coverage</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Notes</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                      <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                        <td className="p-4 text-sm text-gray-800 w-[40%]">{insurance.text}</td>
                        <td className="p-4 text-sm text-gray-800"><textarea className="border p-2 text-xs border-[#f0f0f0] w-[300px]" value={insurance.notes} onChange={(e) => change_insurance_data(e.target.value, 'insurance', 'notes')} /></td>
                        <td className="p-4 text-sm text-gray-800"><FaCircleCheck size={30} color={Number(realartist.insurance_balance) >= requiredbalance ? "green": "grey"}  /></td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#fff] p-4 rounded-lg w-full mt-4">
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Equipment Insurance</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Notes</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                      <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                        <td className="p-4 text-sm text-gray-800 w-[40%]">{equipment.text}</td>
                        <td className="p-4 text-sm text-gray-800"><textarea className="border p-2 text-xs border-[#f0f0f0] w-[300px]" value={equipment.notes} onChange={(e) => change_insurance_data(e.target.value, 'equipment', 'notes')} /></td>
                        <td className="p-4 text-sm text-gray-800"><FaCircleCheck size={30} color={Number(realartist.insurance_balance) >= requiredbalance ? "green": "grey"}  /></td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#fff] p-4 rounded-lg w-full mt-4">
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Work cover</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Notes</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                      <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                        <td className="p-4 text-sm text-gray-800 w-[40%]">{workcover.text}</td>
                        <td className="p-4 text-sm text-gray-800"><textarea className="border p-2 text-xs border-[#f0f0f0] w-[300px]" value={workcover.notes} onChange={(e) => change_insurance_data(e.target.value, 'cover', 'notes')} /></td>
                        <td className="p-4 text-sm text-gray-800"><FaCircleCheck size={30} color={Number(realartist.insurance_balance) >= requiredbalance ? "green": "grey"}  /></td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        }

        {/* TAB 5 */}
        {
          showtab == 5 &&
            <div className="bg-[#fff] p-4 rounded-lg w-full">
               <div className="flex justify-end">
                  <button
                    onClick={() => setShowhide(!showhide)}
                    type="button"
                    className="px-5 py-2 mb-2 rounded-full text-white text-xs tracking-wider border border-current outline-none hover:bg-[#202020] bg-[#56AEFB]"
                  >
                    Add Task/notes
                  </button>
                </div>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border-1 border-[#ccc]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">
                      Task/Notes
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Links</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                   {
                      tasks.length == 0 &&
                          <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                            <td colSpan={3} className="p-4 text-sm font-semibold text-center text-[#f00]">No Tasks/notes found!</td>
                          </tr>
                    }
                    {
                      tasks?.map((item, ind) => {
                        return (
                          <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                            <td className="p-4 text-sm text-gray-800">{item?.name}</td>
                            <td className="p-4 text-sm text-gray-800"><a className="text-[#6767ff]" href={item?.link} target="_blank">{item?.link}</a></td>
                            <td className="p-4 text-sm text-gray-800">
                              <select name="status" onChange={(e) => changeTaskStatus(e, item?.id)} className="p-2 px-4 rounded-full">
                                <option value="1" selected={item?.status == 1 ? true : false} >For Review</option>
                                <option value="2" selected={item?.status == 2 ? true : false}>In Progress</option>
                                <option value="3" selected={item?.status == 3 ? true : false}>Done</option>
                              </select>
                              {/* <input type="checkbox" name="status" checked={item?.status == 1 ? true : false} className="mr-2" value={1} onChange={(e) => changeStatementStatus(e, item?.id)} /> */}
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
        }
        </div>
      </div>


      {showhide && (
        <div
          class="fixed top-0 left-0 right-0 bottom-0 z-[10] bg-[#00000060] backdrop-blur-[5px] h-screen w-full popup_outer"
          id="login_popup"
        >
          <div class="flex justify-center items-center h-full w-full">
            <div class="bg-white p-8 rounded-[20px] backdrop-blur-[50px] w-[90%] md:w-[40%] text-[#454545] relative">
              <div
                class="absolute right-[10px] top-[10px] close_icon cursor-pointer"
                onClick={() => {
                  setShowhide(false);
                }}
              >
                <IoIosCloseCircle size={26} color="#ff6767" />
              </div>
            {
              showtab == 1 &&
              <>
                <h4 class="text-xl font-bold uppercase mb-1 text-center">
                  {edit == "" ? "Add" : "Edit"} Statement
                </h4>
                <form class="mt-6" onSubmit={(e) => do_save_statement(e)}>
                  <div class="form-group mb-4">
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter Statement"
                      required
                      value={statementname}
                      onChange={(e) => setStatementName(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="url"
                      class="form-control"
                      id="link"
                      name="link"
                      placeholder="Enter Links"
                      required
                      value={statementlink}
                      onChange={(e) => setStatementLink(e.target.value)}
                    />
                  </div>
                  <div class="form-group">
                    <button type="submit" class="button_main w-full text-white">
                      {edit == "" ? "Save" : "Update"}
                    </button>
                  </div>
                </form>
              </>
            }

            {
              showtab == 2 &&
              <>
                <h4 class="text-xl font-bold uppercase mb-1 text-center">
                  {edit == "" ? "Add" : "Edit"} Tax Tasks
                </h4>
                <form class="mt-6" onSubmit={(e) => do_save_tax(e)}>
                <div class="form-group mb-4">
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter Country"
                      required
                      value={countrytax}
                      onChange={(e) => setCountryTax(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter Task"
                      required
                      value={statementname}
                      onChange={(e) => setStatementName(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="url"
                      class="form-control"
                      id="link"
                      name="link"
                      placeholder="Enter Links"
                      required
                      value={statementlink}
                      onChange={(e) => setStatementLink(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="date"
                      class="form-control"
                      id="date"
                      name="date"
                      placeholder="Enter Date"
                      required
                      value={datetax}
                      onChange={(e) => setDateTax(e.target.value)}
                    />
                  </div>
                  <div class="form-group">
                    <button type="submit" class="button_main w-full text-white">
                      {edit == "" ? "Save" : "Update"}
                    </button>
                  </div>
                </form>
              </>
            }

          {
              showtab == 3 &&
              <>
                <h4 class="text-xl font-bold uppercase mb-1 text-center">
                  {edit == "" ? "Add" : "Edit"} Contractors
                </h4>
                <form class="mt-6" onSubmit={(e) => do_save_contracts(e)}>
                <div class="form-group mb-4">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      class="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter Expected contractors payments"
                      required
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      class="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter No. people within the country"
                      required
                      value={peoplecountry}
                      onChange={(e) => setPeopleCountry(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      class="form-control"
                      id="link"
                      name="link"
                      placeholder="Enter No. trips within the country"
                      required
                      value={tripcountry}
                      onChange={(e) => setTripCountry(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      class="form-control"
                      id="date"
                      name="date"
                      placeholder="Enter No. people overseas"
                      required
                      value={peopleoversea}
                      onChange={(e) => setPeopleOversea(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      class="form-control"
                      id="date"
                      name="date"
                      placeholder="Enter No. trips overseas"
                      required
                      value={tripoversea}
                      onChange={(e) => setTripOversea(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="text"
                      class="form-control"
                      id="date"
                      name="date"
                      placeholder="Enter Notes"
                      required
                      value={othernotes}
                      onChange={(e) => setOtherNotes(e.target.value)}
                    />
                  </div>
                  <div class="form-group">
                    <button type="submit" class="button_main w-full text-white">
                      {edit == "" ? "Save" : "Update"}
                    </button>
                  </div>
                </form>
              </>
            }

            {
              showtab == 5 &&
              <>
                <h4 class="text-xl font-bold uppercase mb-1 text-center">
                  {edit == "" ? "Add" : "Edit"} Task/Notes
                </h4>
                <form class="mt-6" onSubmit={(e) => do_save_tasks(e)}>
                  <div class="form-group mb-4">
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter Task/Notes"
                      required
                      value={statementname}
                      onChange={(e) => setStatementName(e.target.value)}
                    />
                  </div>
                  <div class="form-group mb-4">
                    <input
                      type="url"
                      class="form-control"
                      id="link"
                      name="link"
                      placeholder="Enter Links"
                      required
                      value={statementlink}
                      onChange={(e) => setStatementLink(e.target.value)}
                    />
                  </div>
                  <div class="form-group">
                    <button type="submit" class="button_main w-full text-white">
                      {edit == "" ? "Save" : "Update"}
                    </button>
                  </div>
                </form>
              </>
            }
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
export default TourDetails;
