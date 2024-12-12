import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "./../Layout";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegTrashAlt, FaEye } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ReactApexChart from 'react-apexcharts'
import Papa from 'papaparse';

const ArtistDetails = () => {
  const { slug } = useParams();
  const uploadcsv = useRef(null);
  const navigate = useNavigate();
  const [showhide, setShowhide] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [artists, setArtists] = useState([]);
  const [tours, setTours] = useState([]);
  const [filterupcomingtours, setFilterUpcomingTours] = useState([]);
  const [filterongoingtours, setFilterOngoingTours] = useState([]);
  const [historyTour, setHistoryTour] = useState([]);
  const [edit, setEdit] = useState("");

  const [tourname, setTourName] =  useState("")
  const [place, setPlace] = useState("")
  const [income, setIncome] = useState("")
  const [datetour, setDateTour] = useState("")


  useEffect(() => {
    const storedArtistsaa = JSON.parse(localStorage.getItem("artists")) || [];
    const artistIndex = storedArtistsaa.findIndex(
      (artist) => Number(artist.id) === Number(slug)
    );
    if (artistIndex !== -1) {
      setArtists(storedArtistsaa[artistIndex]);
      setEmail(storedArtistsaa[artistIndex].email);
      setBalance(storedArtistsaa[artistIndex].insurance_balance);
      setStartDate(storedArtistsaa[artistIndex].startdate);
      setEndDate(storedArtistsaa[artistIndex].enddate);
    }

    // GET ALL TOURS OF THIS USER
    const storeTours = JSON.parse(localStorage.getItem(slug)) || [];
   
    setTours(storeTours)
  }, []);

  useEffect(() => {
    localStorage.setItem(slug, JSON.stringify(tours));
    const today = new Date().toISOString().split('T')[0];
    const filteredTours = tours.filter((artist) => artist.date > today);
    setFilterUpcomingTours(filteredTours)
    const filteredToursOngoing = tours.filter((artist) => artist.date == today);
    setFilterOngoingTours(filteredToursOngoing)

    const filteredToursHistory = tours.filter((artist) => artist.date < today);
    setHistoryTour(filteredToursHistory)
  }, [tours]);

  useEffect(() => {
    setName(artists?.name);
    setEmail(artists?.email);
    setBalance(artists?.insurance_balance);
    setStartDate(artists?.startdate);
    setEndDate(artists?.enddate);
  }, [artists]);

  const do_save_artist = async (e) => {
    e.preventDefault();

    if (email == "") {
      toast.error("Please enter email address");
      return;
    }
    if (balance == "") {
      toast.error("Please enter Insurance Balance");
      return;
    }
    if (startdate == "") {
      toast.error("Please enter Insurance start date");
      return;
    }
    if (enddate == "") {
      toast.error("Please enter Insurance end date");
      return;
    }

    let storedArtists = JSON.parse(localStorage.getItem("artists")) || [];
    const artistIndex = storedArtists.findIndex(
      (artist) => Number(artist.id) === Number(slug)
    );
    if (artistIndex !== -1) {
      storedArtists[artistIndex] = {
        ...storedArtists[artistIndex],
        email: email,
        insurance_balance: balance,
        startdate: startdate,
        enddate: enddate,
      };
      setArtists(storedArtists[artistIndex]);
      localStorage.setItem("artists", JSON.stringify(storedArtists));
      toast.success("Artist information updated successfully");
    } else {
      toast.error("No artist found with the specified ID");
    }
    setShowhide(false);
  };

  const do_save_tour = async (e) => {
    e.preventDefault();

    if (tourname == "") {
      toast.error("Please enter Tour name");
      return;
    }
    if (place == "") {
      toast.error("Please enter Place");
      return;
    }
    if (income == "") {
      toast.error("Please enter expected income");
      return;
    }
    if (datetour == "") {
      toast.error("Please enter Tour date");
      return;
    }

    if (edit === "") {
        const uniqueID = Date.now();
        const newTour = {
          art_id: slug,
          id: uniqueID,
          name: tourname,
          place: place,
          income: income,
          date: datetour,
        };

        setTours((prevArtists) => [...prevArtists, newTour]);
        toast.success("Tour information added successfully");
    } else {
      const updatedArtists = [...tours]; 
      updatedArtists[edit].name = tourname;
      updatedArtists[edit].place = place;
      updatedArtists[edit].income = income;
      updatedArtists[edit].date = datetour;
      setTours(updatedArtists);
      toast.success("Tour information updated successfully");
    }
    setTourName("")
    setPlace("")
    setIncome("")
    setDateTour("")

    setShowhide(false);
  };

  const EditPopup = (ind, row) => {
    setEdit(ind);
    setTourName(row?.name);
    setPlace(row?.place)
    setIncome(row?.income)
    setDateTour(row?.date)
    setShowhide(true);
  };

  const delete_artist = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this tour?"
    );
    if (userConfirmed) {
      const index = tours.findIndex((artist) => artist.id === id);
      tours.splice(index, 1);
      setTours([...tours]);
      toast.success("Tour deleted successfully");
    }
  };

  // const ApexChart = () => {
  //   const [chartData] = useState({
  //     series: [{
  //       name: "Income",
  //       data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 200, 300]
  //     }],
  //     options: {
  //       chart: {
  //         height: 350,
  //         type: 'line',
  //         zoom: {
  //           enabled: false
  //         }
  //       },
  //       dataLabels: {
  //         enabled: false
  //       },
  //       stroke: {
  //         curve: 'straight'
  //       },
  //       title: {
  //         text: '',
  //         align: 'left'
  //       },
  //       grid: {
  //         row: {
  //           colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
  //           opacity: 0.5
  //         },
  //       },
  //       xaxis: {
  //         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //         title: {
  //           text: 'Date', // X-axis title
  //           style: {
  //             color: '#333', // color of the title
  //             fontSize: '14px', // font size
  //             fontWeight: 'bold' // font weight
  //           }
  //         }
  //       },
  //       yaxis: {
  //         title: {
  //           text: 'Income', // Y-axis title
  //           style: {
  //             color: '#333', // color of the title
  //             fontSize: '14px', // font size
  //             fontWeight: 'bold' // font weight
  //           }
  //         }
  //       }
  //     }
  //   });
  
  //   return (
  //     <div>
  //       <div id="chart">
  //         <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
  //       </div>
  //       <div id="html-dist"></div>
  //     </div>
  //   );
  // };
  
  const ApexChart = () => {
    const [chartData, setChartData] = useState({
      series: [{
        name: "Income",
        data: [],
      }],
      options: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: '',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          title: {
            text: 'Date',
            style: {
              color: '#333',
              fontSize: '14px',
              fontWeight: 'bold'
            }
          }
        },
        yaxis: {
          title: {
            text: 'Income',
            style: {
              color: '#333',
              fontSize: '14px',
              fontWeight: 'bold'
            }
          }
        }
      }
    });
  
    useEffect(() => {
      // Get the current date and current year
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
    
      // Filter data for dates less than today
      const filteredData = tours.filter(item => new Date(item.date) < currentDate);
    
      // Initialize an array to hold the sum of income by month
      const monthlyIncome = Array(12).fill(0); // 12 months, initialize to 0
    
      // Loop through the filtered data and sum the income for each month
      filteredData.forEach(item => {
        const itemDate = new Date(item.date);
        const itemYear = itemDate.getFullYear();
        const itemMonth = itemDate.getMonth(); // 0 = Jan, 1 = Feb, etc.
    
        // Only include items from the current year
        if (itemYear === currentYear) {
          // Ensure item.income is a number before adding
          const incomeAmount = Number(item.income);  // Convert to number
          monthlyIncome[itemMonth] += incomeAmount;  // Add income to the corresponding month
        }
      });
    
      // Update chart data state with the summed monthly income
      setChartData(prevData => ({
        ...prevData,
        series: [{
          name: "Income",
          data: monthlyIncome
        }]
      }));
    }, [tours]);
    
  
    return (
      <div>
        <div id="chart">
          <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
        </div>
      </div>
    );
  };

  const handleButtonClick = () => {
    uploadcsv.current.click();
  };

  

  const [csvData, setCsvData] = useState([]);
  // Function to handle the file upload and parse the CSV
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Use PapaParse to parse the CSV file
      Papa.parse(file, {
        complete: (result) => {
          console.table(result.data)
          setCsvData(result.data);
        },
        header: true, // Optional: treat the first row as headers
        skipEmptyLines: true, // Optional: skip empty lines
      });
    }
  };
  // console.log(tours, "To0uss")
  const transformData = (data) => {
    return data.map((item, index) => ({
      art_id: slug,
      id: Date.now() + index,
      name: item.Name,
      place: item.Place,
      income: item.Income,
      date: item.Date,
    }));
  };
  useEffect(() => {
    // if(csvData.length === 0 && csvData != null){ 
    //   toast.error("Please upload a CSV file with data");
    //   return;
    // }
    const newData = transformData(csvData);
    setTours(prevTours => [...prevTours, ...newData]);
    // console.log("Tours", tours);
  }, [csvData.length > 0]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-800 text-md font-bold uppercase">
          <span>Artist Detail</span>s
        </div>
      </div>

      

      <div className="flex justify-between gap-3">
        {/* FORM DETAILS */}
        <div className="box_white w-1/4 shadow-lg">
          <form onSubmit={do_save_artist}>
            <div className="mb-4 font-bold flex items-center gap-4">
              <img
                src={`https://ui-avatars.com/api/?name=${name}&background=random&color=ffffff`}
                className="rounded-full w-11 h-11"
              />
              {name}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-xs  mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border-[#f0f0f0] border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-xs  mb-2">
                Insurance balance ($)
              </label>
              <input
                type="number"
                required
                min={0}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="shadow appearance-none border-[#f0f0f0] border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-xs  mb-2">
                Insurance Start Date
              </label>
              <input
                type="date"
                required
                value={startdate}
                onChange={(e) => setStartDate(e.target.value)}
                className="shadow appearance-none border-[#f0f0f0] border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-xs  mb-2">
                Insurance End Date
              </label>
              <input
                type="date"
                required
                value={enddate}
                onChange={(e) => setEndDate(e.target.value)}
                className="shadow appearance-none border-[#f0f0f0] border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[var(--button-color)] w-full mb-0 hover:bg-[#202020] text-white py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>

        {/* TABLE DETAILS */}
        <div className="box_white w-3/4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-800 text-md font-bold uppercase">
              Tours
            </div>
            <input
              type="file"
              ref={uploadcsv}
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div>
              <button type="button" onClick={handleButtonClick} className="px-5 py-2 rounded-full text-white text-xs tracking-wider border border-current outline-none hover:bg-[#202020] bg-[#56AEFB] mr-2">
                Upload CSV
              </button>
              <button
                onClick={() => setShowhide(!showhide)}
                type="button"
                className="px-5 py-2 rounded-full text-white text-xs tracking-wider border border-current outline-none hover:bg-[#202020] bg-[#56AEFB]"
              >
                Add Tour
              </button>
            </div>
          </div>

          {/* UPCOMING TOURS */}
          <div className="bg-[#fff] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-800 text-sm font-bold uppercase">
                Upcoming Tours
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-1 border-[#ccc]">
                <thead className="whitespace-nowrap">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">
                      Tour Name
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Place</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Expected income</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0] w-[150px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {filterupcomingtours.length == 0 && (
                    <tr className="hover:bg-gray-10 text-center">
                      <td colSpan={6} className="p-4 text-sm text-[#ff6767]">
                        No Tour(s) found!
                      </td>
                    </tr>
                  )}
                  {
                  filterupcomingtours.map((artist, index) => (
                    <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                      <td className="p-4 text-sm text-gray-800">
                        {artist.name}
                      </td>
                      <td className="p-4 text-sm text-gray-800">{artist.place}</td>
                      <td className="p-4 text-sm text-gray-800">${artist.income}</td>
                      <td className="p-4 text-sm text-gray-800">{artist.date}</td>
                      <td className="p-4 text-sm text-gray-800">
                        <span className="flex items-center gap-3">
                          <FaEye
                            size={20}
                            color="#444"
                            className="cursor-pointer"
                            onClick={() => navigate(`/tour/details/${artist.art_id}/${artist.id}`)}
                          />
                          <MdEditSquare
                            size={20}
                            color="#444"
                            className="cursor-pointer"
                            onClick={() => EditPopup(index, artist)}
                          />
                          <FaRegTrashAlt
                            size={18}
                            color="#ff6767"
                            className="cursor-pointer"
                            onClick={() => {
                              delete_artist(index);
                            }}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ONGOING TOURS */}
          <div className="bg-[#fff] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-800 text-sm font-bold uppercase">
                Ongoing Tours
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-1 border-[#ccc]">
                <thead className="whitespace-nowrap">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">
                      Tour Name
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Place</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Expected income</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0] w-[150px]">
                      
                    </th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {filterongoingtours.length == 0 && (
                    <tr className="hover:bg-gray-10 text-center">
                      <td colSpan={6} className="p-4 text-sm text-[#ff6767]">
                        No Tour(s) found!
                      </td>
                    </tr>
                  )}
                  {filterongoingtours.map((artist, index) => (
                    <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                      <td className="p-4 text-sm text-gray-800">
                        {artist.name}
                      </td>
                      <td className="p-4 text-sm text-gray-800">{artist.place}</td>
                      <td className="p-4 text-sm text-gray-800">${artist.income}</td>
                      <td className="p-4 text-sm text-gray-800">{artist.date}</td>
                      <td className="p-4 text-sm text-gray-800">
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* HISTORY TOURS */}
          <div className="bg-[#fff] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-800 text-sm font-bold uppercase">
                 Tours History
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-1 border-[#ccc]">
                <thead className="whitespace-nowrap">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">
                      Tour Name
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Place</th>
                    
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-800 bg-[#f0f0f0]">Income</th>
                   
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {historyTour.length == 0 && (
                    <tr className="hover:bg-gray-10 text-center">
                      <td colSpan={6} className="p-4 text-sm text-[#ff6767]">
                        No Tour(s) found!
                      </td>
                    </tr>
                  )}
                  {historyTour.map((artist, index) => (
                    <tr className="hover:bg-gray-100 even:bg-[#f0f0f0]">
                      <td className="p-4 text-sm text-gray-800">
                        {artist.name}
                      </td>
                      <td className="p-4 text-sm text-gray-800">{artist.place}</td>
                     
                      <td className="p-4 text-sm text-gray-800">{artist.date}</td>
                      <td className="p-4 text-sm text-gray-800">
                      <input
                          type="number"
                          name="income"
                          min={0}
                          step={0.01}
                          className="w-full border border-gray-300 rounded-md p-2"
                          value={tours.find((tour) => tour.id === artist.id)?.income || ''}  // Find the tour with matching `id`
                          onChange={(e) => {
                            // Update income of the tour with the matching `id`
                            const updatedTours = tours.map((tour) => 
                              tour.id === artist.id 
                                ? { ...tour, income: parseFloat(e.target.value) || 0 }  // Update income only for the matching tour
                                : tour  // Keep other tours unchanged
                            );
                            setTours(updatedTours);
                          }}
                        />

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="box_white w-full mb-4 shadow-lg mt-6">
      <ApexChart />
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
                  setBalance(""); setDateTour(""), setPlace(""), setTourName("")
                }}
              >
                <IoIosCloseCircle size={26} color="#ff6767" />
              </div>
              <h4 class="text-xl font-bold uppercase mb-1 text-center">
                {edit == "" ? "Add" : "Edit"} Tour
              </h4>
              <form class="mt-6" onSubmit={(e) => do_save_tour(e)}>
                <div class="form-group mb-4">
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    placeholder="Tour name"
                    required
                    value={tourname}
                    onChange={(e) => setTourName(e.target.value)}
                  />
                </div>
                <div class="form-group mb-4">
                  <input
                    type="text"
                    class="form-control"
                    id="place"
                    name="place"
                    placeholder="Place"
                    required
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                  />
                </div>
                <div class="form-group mb-4">
                  <input
                    type="number"
                    min={0}
                    class="form-control"
                    id="income"
                    name="income"
                    placeholder="Expected income"
                    required
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                <div class="form-group mb-4">
                  <input
                    type="date"
                    class="form-control"
                    id="date"
                    name="date"
                    placeholder="Date"
                    required
                    value={datetour}
                    onChange={(e) => setDateTour(e.target.value)}
                  />
                </div>
                <div class="form-group">
                  <button type="submit" class="button_main w-full text-white">
                    {edit == "" ? "Save" : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
export default ArtistDetails;
