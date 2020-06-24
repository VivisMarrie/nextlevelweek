import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./styles.css";
import logo from "../../assets/logo.svg";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";
import axios from "axios";
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/dropzone'

interface Item {
  id: number;
  name: string;
  image_url: string;
}

interface UfType {
  sigla: string;
}

interface CidadesType {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cidades, setcidades] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [selectedUF, setSelectedUF] = useState<string>("0");
  const [selectedCidade, setSelectedCidade] = useState<string>("0");
  const [selectedPos, setSelectedPos] = useState<[number, number]>([0, 0]);

  const [initialPos, setInitialPos] = useState<[number, number]>([0, 0]);

  const [selectedFile, setSelectedFile] = useState<File>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whats: ''
  });

  const history = useHistory();
async function handleSubmit(event: FormEvent){
  
  event.preventDefault();
  
  const {name, email, whats } = formData;
  const uf= selectedUF;
  const city= selectedCidade;
  const [latitude, longitude] = selectedPos;
  const items = selectedItems;

  const data = new FormData();
  data.append('name', name); 
  data.append('email', email); 
  data.append('whats', whats); 
  data.append('uf', uf); 
  data.append('city', city); 
  data.append('items', items.join(',')); 
  data.append('latitude', String(latitude)); 
  data.append('longitude', String(longitude));
  if(selectedFile){   
    data.append('image', selectedFile);   
  }

  await api.post('points', data);

  history.push('/');
}

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const {name, value} = event.target;
    setFormData({...formData, [name]: value});
  }

function handleSelectItem(id: number){
  const alreadySelected = selectedItems.findIndex(item => item === id);
  if(alreadySelected>=0){
    const filtereditems = selectedItems.filter(item => item !== id);
    setSelectedItems(filtereditems);
  } else{
  setSelectedItems([...selectedItems, id]);
  }
}

  function handleMapClick(event: LeafletMouseEvent){
    setSelectedPos([event.latlng.lat , event.latlng.lng]);
  }

  function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUF(event.target.value);
  }

  function handleSelectCidade(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCidade(event.target.value);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPos([
        latitude, longitude
      ])
    })
  }, []);

  useEffect(() => {
    api.get("items").then((response) => setItems(response.data));
  }, []);

  useEffect(() => {
    axios
      .get<UfType[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufsResponse = response.data.map((uf) => uf.sigla);
        setUfs(ufsResponse);
      });
  }, []);

  useEffect(() => {
    //load cidades
    if (selectedUF === "O") {
      return;
    }
    axios
      .get<CidadesType[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      )
      .then((response) => {
        const cidadesResponse = response.data.map((cidade) => cidade.nome);
        setcidades(cidadesResponse);
      });
  }, [selectedUF]);

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft /> Voltar para Home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do
          <br />
          ponto de coleta
        </h1>
        <Dropzone onFileUpload={setSelectedFile}/>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputChange}/>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" onChange={handleInputChange} />
            </div>
            <div className="field">
              <label htmlFor="whats">WhatsApp</label>
              <input type="text" name="whats" id="whats" onChange={handleInputChange} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPos} zoom={15}
          onClick={handleMapClick}>
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPos} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                onChange={handleSelectUF}
                value={selectedUF}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cidade">Cidade</label>
              <select
                name="cidade"
                id="cidade"
                onChange={handleSelectCidade}
                value={selectedCidade}
              >
                <option value="0">Selecione uma Cidade</option>
                {cidades.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Itens de Coleta</h2>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li key={item.id} onClick={() => handleSelectItem(item.id)}
              className={selectedItems.includes(item.id) ? 'selected' : ''}>
                <img src={item.image_url} alt="{item.name}" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>          
        </fieldset>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default CreatePoint;
