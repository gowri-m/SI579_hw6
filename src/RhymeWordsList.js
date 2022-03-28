import {useRef,useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RhymeWord from './RhymeWord';


function RhymeWordsList () {

    const inputEl = useRef(null);
    
    const [outDescEl, setOutDescEl] = useState('');
    const [state, setState] = useState(false);
    const [dataResponse, setDataResponse] = useState(null);
    const [savedOutput, setSavedOutput] = useState(null);
    let savedWords = [];
       
    async function showRhymingWords() {        
        const input_word = inputEl.current.value;
        const res = await fetch("https://api.datamuse.com/words?rel_rhy=" + input_word);
        const data = await res.json();

        setOutDescEl('Words that rhyme with ' + input_word + ":");
        setDataResponse('Loading...');
        setState(true);
        
        if(data.length === 0){
            setDataResponse('(no result)');
        }else{
            const wordGroups = groupBy(data, 'numSyllables');
            let elements = []
            Object.values(wordGroups).forEach(eachGroup => {      
                const sub_elements = eachGroup.map((item, i) => <RhymeWord sylVal={i ? '' : item.numSyllables+' Syllable'} keyVal={i} description={item.word} onClickSaveWords={()=>saveWords(item.word)}/>)
                elements.push(sub_elements);
            });
            setDataResponse(elements);
        }  
        //console.log(data);
    }

    async function showSynonyms() {
        const input_word = inputEl.current.value;
        const res = await fetch("https://api.datamuse.com/words?ml=" + input_word);
        const data = await res.json();
        
        setOutDescEl('Words with a meaning similar to ' + input_word + ':');
        setDataResponse('Loading...');
        setState(true);

        if(data.length === 0){
            setDataResponse('(no result)');
        }else{
            const elements = data.map((item, i) => <RhymeWord description={item.word} onClickSaveWords={()=>saveWords(item.word)}/>)
            setDataResponse(elements);
        }
        //console.log(data);
      }

    function saveWords(newWord) {
        if(savedWords.length !== 0){
            savedWords.push(newWord);
        }else if(savedOutput){
            savedWords = savedOutput.split(',');
            savedWords.push(newWord);
        }else{
            savedWords.push(newWord);
        }
        
        setSavedOutput(savedWords.join(','));
        console.log(savedWords);
    }


    /**
     * Returns a list of objects grouped by some property. For example:
     * groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
     * 
     * returns:
     * { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
     *    'red': [{name: 'Jack', team: 'red'}]
     * }
     * 
     * @param {any[]} objects: An array of objects
     * @param {string|Function} property: A property to group objects by
     * @returns  An object where the keys representing group names and the values are the items in objects that are in that group
     */
     function groupBy(objects, property) {
        // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
        // value for property (obj[property])
        if(typeof property !== 'function') {
            const propName = property;
            property = (obj) => obj[propName];
        }

        const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
        for(const object of objects) {
            const groupName = property(object);
            //Make sure that the group exists
            if(!groupedObjects.has(groupName)) {
                groupedObjects.set(groupName, []);
            }
            groupedObjects.get(groupName).push(object);
        }

        // Create an object with the results. Sort the keys so that they are in a sensible "order"
        const result = {};
        for(const key of Array.from(groupedObjects.keys()).sort()) {
            result[key] = groupedObjects.get(key);
        }
        return result;
    }

    return (<div className="container"> 
        <h1 className="row">Rhyme Finder (579 Problem Set 6)</h1>
        <div className="row">
            <div className="col">Saved words: <span>{savedOutput ? savedOutput : ''}</span></div>
        </div>
        <div className="row">
            <div className="input-group col">
                <input ref={inputEl} className="form-control" type="text" placeholder="Enter a word"/>
                <button type="button" onClick={() => showRhymingWords()} className="btn btn-primary">Show rhyming words</button>
                <button type="button" onClick={() => showSynonyms()} className="btn btn-secondary">Show synonyms</button>
            </div>
        </div>
        <div className="row">
            <h2 className="col">
                <output>{outDescEl}</output>
            </h2>
        </div>
        <div className="output row">
            <output className="col">
                { state ? dataResponse : ''}
            </output>
        </div>
    </div>)
    
}

export default RhymeWordsList;