import { useRouter } from "next/router";

export default function Search(props) {
    const router = useRouter();
    router.push("/search/flight");

    return (
    <></>
    );
}

// import { fetchAirportCsv, fetchCountryCsv, filterObjByCity, filterObjByCountry, getAirportByISO, getCityList, getCountryList } from '@/lib/airportData';
// import { airportCsvAtom, countryCsvAtom, objByCityAtom, objByCountryAtom } from '@/store';
// import { useAtom } from 'jotai';
// import { useRouter } from 'next/router';
// import React, { useState, useEffect } from 'react';
// import { Card, Col, Form, Row } from 'react-bootstrap';

// function CsvReader() {
//   const [csvData, setCsvData] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [countryCsv, setCountryCsv] = useAtom(countryCsvAtom);
//   const [objByCountry, setObjByCountry] = useAtom(objByCountryAtom);
//   const [objByCity, setObjByCity] = useAtom(objByCityAtom);
//   const [airports, setAirports] = useState([]);
//   const [selectedAirport, setSelectedAirport] = useState(null);

//   useEffect(() => {
//     updateAtoms();
//     loadData();
//   }, []);

//   //load csv data if there are not yet loaded
//   async function updateAtoms() {
//     setCountryCsv(await fetchCountryCsv());
//     //setAirportCsv(await fetchAirportCsv());
//   }

//   async function loadData() {
//     // const airportsObj = await getAirportByISO("CA", airportCsv);
//     // var airports = [];
//     // airportsObj.forEach((airport) => {
//     //     console.log(airport)
//     //     airports.push(airport.name);
//     // })
//     // setCountries(airports);
    
//     var currentObj = await filterObjByCountry("Canada", objByCountry);
//     setObjByCountry(currentObj);
//     currentObj = await filterObjByCity("Toronto", currentObj);
//     setObjByCity(currentObj);
//   }

//   const handleCardClick = (value) => {
//         setSelectedAirport(value);
//     };

//   return (
//     <div>
//       <h1>CSV Data</h1>
//       {csvData.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               {Object.keys(csvData[0]).map((key) => (
//                 <th key={key}>{key}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {csvData.map((row, index) => (
//               <tr key={index}>
//                 {Object.values(row).map((value, i) => (
//                   <td key={i}>{value}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>Loading CSV data...</p>
//       )}

//     <Row className='gy-4 m-3'>
//     {
//         objByCity ? objByCity.map((airport, index) => (
//             <Col md={4} key={index} onClick={()=>handleCardClick(airport.IATA)}>
//                 <Card className={selectedAirport === airport.IATA ? 'card-selectable active' : 'card-selectable' } role='button'>
//                     <Card.Body>
//                             <div className='d-flex justify-content-between align-items-center'>
//                                     <Form.Check 
//                                         type="radio"
//                                         id={`check_${index}`}
//                                         name='airport'
//                                         value={airport.IATA}
//                                         checked={selectedAirport === airport.IATA}
//                                         onChange={() => setSelectedAirport(airport.IATA)}
//                                     />
//                                     <Row className='text-end'>
//                                         <Col xs={12} className='fw-bold'>
//                                             {airport.Name}
//                                         </Col>
//                                         <Col xs={12}>
//                                             {airport.City}
//                                         </Col>
//                                         <Col xs={12}>
//                                             {airport.Country}
//                                         </Col>
//                                     </Row>
//                             </div>
//                     </Card.Body>
//                 </Card>
//             </Col>
//         )) : []
//     }
//     </Row>
    
//     </div>
//   );
// }

// export default CsvReader;