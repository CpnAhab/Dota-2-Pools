import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { heroes } from './utils/heroes.js'
import { Button, HeroesByAttribute } from './utils/components.js'

function Page() {

    const [str, setStr] = useState(heroes[0]);
    const [agi, setAgi] = useState(heroes[1]);
    const [int, setInt] = useState(heroes[2]);
    
    const [status, setStatus] = useState("");

    const[textBox, setTextBox] = useState("User ID");

    const [checkedHeroes, setCheckedHeroes] = useState(
        new Array(str.length + agi.length + int.length).fill(false)
    );

    useEffect(() => {
         console.log("fetching heroes");
         fetch('/api/heroes')
         .then(console.log("accessed /test"))
         .then(res => res.json())
         .then(data => {
             setStr(data.str);
             setAgi(data.agi);
             setInt(data.int);
         });
    }, []);

    const handleHeroChange = (position) => {

        const updateChecked = checkedHeroes.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedHeroes(updateChecked);
    };

    const handleAttributeChange = (e, attrStr, startVal) => {

        const x = document.getElementsByClassName(attrStr);
        const updateChecked = checkedHeroes.map((item, index) =>
            (startVal <= index && index < startVal + x.length) ? e.target.checked : item
        );

        setCheckedHeroes(updateChecked);
    }

    const handleTextChange = (e) => {
        setTextBox(e.target.value);
    }

    function _genChecked() {

        const heroes = str.concat(agi).concat(int);
        const names = [];

        for (let i = 0; i < checkedHeroes.length; i++) {
            if(checkedHeroes[i]) {
                names.push(heroes[i]);
            }
        }

        return names;
    }

    function handleRandom() {

        fetch("/api/random", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({"checkedHeroes": _genChecked()})
            }
        ).then(resp => resp.json())
        .then(json => {
            setStatus(json["choice"]);
        })
    }

    function handleToText() {

        fetch("/api/to_text", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({"checkedHeroes": _genChecked()})
            }
        ).then(resp => resp.json())
        .then(json => {
            setStatus(json["choice"]);
        })
    }
    
    function handleDownload() {

        fetch("/api/download", {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({"checkedHeroes": _genChecked()})
            }
        ).then(setStatus("File download started."));        
    }

    function handleTest() {

        fetch("/test", {
            method: "POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({"test": "test content"})
            }
        ).then(resp => resp.json)
        .then(i => console.log(i));
    }

    function handleLoad() {

        console.log("Loading");
        console.log(textBox);
        fetch("/api/load", {
            method: "POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({"user":textBox})
            }
        ).then(resp => resp.json)
        .then(i => console.log("received" + i))
        .then(data => console.log("Received" + data.pool));
    }

    function handleSave() {

        console.log("Saving" + textBox);

        let pool = [];
        for(let i = 0; i < checkedHeroes.length; i++){
            if (checkedHeroes[i] == true) {
                pool.push(i);
            }
        }
        console.log(pool);
        fetch("/api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({"user":textBox, "pool":pool})
        }
        ).then(resp => resp.json)
        .then(i => console.log("received " + i));

    }

    function renderHeroesByAttribute(attrStr, attribute, startVal) {
        
        return (
            <HeroesByAttribute 
            attrStr={attrStr}
            attribute={attribute}
            startVal={startVal}
            onChange={(e) => handleAttributeChange(e, attrStr, startVal)}
            onHeroChange={handleHeroChange}
            checkedHeroes={checkedHeroes}
            />
        )
    }

    return (
        <div className="main">
            <style> @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&display=swap'); </style>
            <div className="heropools">
                {renderHeroesByAttribute("Strength", str, 0)}
                {renderHeroesByAttribute("Agility", agi, str.length)}
                {renderHeroesByAttribute("Intelligence", int, str.length + agi.length)}
            </div>
            <div className="submissions">
                <h1> Dota 2 Hero Pool Generator </h1>
                <div className="buttonblock">
                    <Button text="Choose a random hero" onClick={handleRandom} />
                    <Button text="Convert to text" onClick={handleToText} />
                    <Button text="Export as .txt" onClick={handleDownload} />
                    <Button text="Add to SquireBot" onClick={handleTest} />
                    <input autoComplete="off" autoFocus className="user_input" value={textBox} onChange={handleTextChange} />
                    <Button text="Load User Pool" onClick={handleLoad} />
                    <Button text="Save User Pool" onClick={handleSave} />
                    <h3>{status}</h3>
                </div>
            </div>
        </div>
    )
}

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
