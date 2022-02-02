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
        ).then(console.log("received answer"));
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
                <Button value={"random"} text={"Choose a random hero"} onClick={handleRandom} />
                <Button value={"to_text"} text={"Convert to text"} onClick={handleToText} />
                <Button value={"download"} text={"Export as .txt"} onClick={handleDownload} />
                <Button value={"to_sb"} text={"Add to SquireBot"} onClick={handleTest} />
                <h3>{status}</h3>
            </div>
        </div>
    )
}

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
