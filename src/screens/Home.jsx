import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
    var Airtable = require('airtable')
    var base = new Airtable({apiKey: 'keysUrvtv0m0GGiz8'}).base('app8ZbcPx7dkpOnP0')

    const {state} = useLocation()
    const navigate = useNavigate()
    const [fullRecord, setFullRecord] = useState([])
    const { name } = state

    //Returns comma seperated string of record filters
    const queryBuilder = (array) => {
        let myFilters = array.map((record) => {
            return `RECORD_ID() = "${record}"`
        }).join(",")

        return "OR(" + myFilters + ")"
    }

    //Fetch all the records for a particular user
    const fetchRecords = () => {
        base('Students')
        .select({
            filterByFormula: `{Name} = "${name}"`
        })
        .firstPage().then((records) => {
            if(records.length === 0){
                console.log("USER DOES NOT EXIST")
                return
            }

            //assume the name used to login is unique
            const classes = records[0].fields.Classes
            const classQuery = queryBuilder(classes)

            //selects classes associated with particular user
            base('Classes').select({
                filterByFormula: classQuery
            })
            .firstPage().then((classRecord) => {
                let allCat = classRecord.map((cls) => {
                    return {
                        class: cls,
                        students: []
                    }}
                )
    
                const students = [].concat.apply([], classRecord.map((rec) => {
                    return rec.fields.Students
                }))
                const studentQuery = queryBuilder(students)

                //selects all students in these selected classes
                base('Students').select({
                    filterByFormula: studentQuery
                })
                .firstPage().then((studentRecord) => {
                    //maps students to their classes
                    studentRecord.forEach((rec) => {
                        allCat = allCat.map((cat) => {
                            if(rec.fields.Classes.includes(cat.class.id)){
                                cat.students.push(rec.fields.Name)
                                return cat
                            }
                            return cat
                        })
                    })
                    allCat = allCat.map((rec) => {
                        rec.class = rec.class.fields.Name
                        return rec
                    })
                    setFullRecord(allCat)
                })
                .catch((err) => {
                    console.error(err)
                })
            })
            .catch((err) => {
                console.error(err)
            })
        })
        .catch((err) => {
            console.error(err)
        })
    }

    //load records on mount
    useEffect(()=> {
        fetchRecords()
    }, [state])

    return ( 
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px" }}>
            <div style={{  marginBottom: "20px" }}>
                <button onClick={() => navigate('/')}>Logout</button>
            </div>

            <div>
                {
                    fullRecord.map((userRecord, index) => {
                        return (
                            <div key={index} style={{ backgroundColor: "blue", color: "snow", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
                                <div>Class : <strong style={{ color: "lightblue" }}>{userRecord.class}</strong></div>
                                <div>Students: {userRecord.students.join(", ")}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
     );
}
 
export default Home;