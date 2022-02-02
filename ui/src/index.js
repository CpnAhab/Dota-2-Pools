import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery';
import { heroes } from './heroes.js'

function Hero(props) {
    
    return (
        <input 
        type="checkbox" 
        id="hero" 
        className={props.className} 
        name={props.name}
        onChange={props.onChange}
        checked={props.checked}
        style={{background: "url(https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/" + props.name + ".png)", backgroundSize: "cover"}}
        />
    )
}

function Button(props) {

    return (
        <div className="buttonblock">
            <button
            type="submit"
            name="op"
            value={props.value}
            onClick={props.onClick}
            >
                {props.text}
            </button>
        </div>
    )
}

function HeroesByAttribute(props) {
    
    function renderHero(i) {

        return (
            <Hero 
            className={props.attrStr}
            name={props.attribute[i]}
            key={i}
            onChange={() => props.onHeroChange(i+props.startVal)}
            checked={props.checkedHeroes[i+props.startVal]}
            />
        )
    }

    let heroes = [];
    for (let i = 0; i < props.attribute.length; i++) {
        heroes.push(renderHero(i));
    }

    return (
        <>
        <h2>
            {props.attrStr} <input type="checkbox" id={props.attrStr} onChange={props.onChange} />
        </h2>
        {heroes}</>
        )
    }

function Page() {

    const [str, setStr] = useState(heroes[0]);
    const [agi, setAgi] = useState(heroes[1]);
    const [int, setInt] = useState(heroes[2]);
    
    const [status, setStatus] = useState("");

    const [checkedHeroes, setCheckedHeroes] = useState(
        new Array(str.length + agi.length + int.length).fill(false)
    );

    // Change test to /api/heroes if intending to fetch heroes from DB.
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

    function handleAttributeChange(e, attrStr) {

        const x = document.getElementsByClassName(attrStr);
        console.log(attrStr);
        console.log(x);
        
        for(let i = 0; i < x.length; i++) {
            x[i].checked = e.target.checked;
        }

        console.log(e.target.checked);
        console.log(x[0].checked, x[0].name);

        const updateChecked = checkedHeroes.map((item, index) =>
            (x[0].id <= index <= x[x.length-1].id) ? e.target.checked : item
        );

        setCheckedHeroes(updateChecked);
        console.log(checkedHeroes);
        /*
        for(let i = startVal; i < startVal + attribute.length; i++) {
            checkedHeroes[i] = e.target.checked;
        }
        
        if (e.target.checked) {
            $('.' + e.target.id).prop('checked', true);
        } else {
            $('.' + e.target.id).prop('checked', false);
        } */
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
                "content_type":"application/json",
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
                "content_type":"application/json",
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
            headers:{
                "content_type":"application/json",
            },
            body:JSON.stringify({"checkedHeroes": _genChecked()})
            }
        ).then(setStatus("File download started."));        
    }

    function renderHeroesByAttribute(attrStr, attribute, startVal) {
        
        return (
            <HeroesByAttribute 
            attrStr={attrStr}
            attribute={attribute}
            startVal={startVal}
            onChange={(e) => handleAttributeChange(e, attrStr)}
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
                <Button value={"to_sb"} text={"Add to SquireBot"} onClick={handleRandom} />
                <h3>{status}</h3>
            </div>
        </div>
    )
}

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
