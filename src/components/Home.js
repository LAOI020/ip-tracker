import React, { useEffect, useState } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import Swal from 'sweetalert2';
import Pin from './Pin';
import { httpGetMyIP, httpSearchIP } from '../helpers/httpRequest';
import { useForm } from '../hooks/useForm';
import { SearchIpInput } from './SearchIpInput';
import { InfoIP } from './InfoIP';
import { IconsTheme } from './IconsTheme';


export const Home = () => {

    const successLocation = (data) => {
        setViewport({
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            width: '100vw',
            height: '100vh',
            zoom: 15
        });

        setMarkerLocation({
            latitude: data.coords.latitude,
            longitude: data.coords.longitude, 
        });
    };

    const errorLocation = (err) => {
        console.log('error location');
        console.log(err);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            successLocation,
            errorLocation,
            {enableHighAccuracy: true}
        );

    }, []);

    const [formValue, changeInput] = useForm({
        'searchIP': ''
    });
    const {searchIP: inputSearchIP} = formValue;

    const [viewport, setViewport] = useState({
        latitude: 52.6376,
        longitude: -1.135171,
        width: '100vw',
        height: '100vh',
        zoom: 15
    });

    const [markerLocation, setMarkerLocation] = useState({
        latitude: 52.6376,
        longitude: -1.135171,
    });

    const [darkMode, setDarkMode] = useState(true);

    const clickGetMyIP = async () => {
        const dataIP = await httpGetMyIP();

        if(dataIP.status !== 'success'){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'IP invalida',
            });

        } else {
            setViewport({
                latitude: dataIP.latitude,
                longitude: dataIP.longitude,
                width: '100vw',
                height: '100vh',
                zoom: 15
            });
            
            setMarkerLocation({
                latitude: dataIP.latitude,
                longitude: dataIP.longitude,
                country: dataIP.country_name,
                region: dataIP.region_name,
                city: dataIP.city,
                ip: dataIP.ip
            });
        }
    };

    const clickSearchIP = async () => {
        const dataIP = await httpSearchIP(inputSearchIP);

        if(dataIP.status !== 'success'){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'IP invalida',
            });

            return;
        }

        setViewport({
            latitude: dataIP.latitude,
            longitude: dataIP.longitude,
            width: '100vw',
            height: '100vh',
            zoom: 15
        });

        setMarkerLocation({
            latitude: dataIP.latitude,
            longitude: dataIP.longitude,
            country: dataIP.country_name,
            region: dataIP.region_name,
            city: dataIP.city,
            ip: dataIP.ip
        });
    }

    return (
        <>
        <SearchIpInput
            clickGetMyIP={clickGetMyIP}
            clickSearchIP={clickSearchIP}
            valueInput={inputSearchIP}
            changeInput={changeInput}
        />

        {markerLocation.country ?
            <InfoIP
                country={markerLocation.country}
                region={markerLocation.region}
                city={markerLocation.city}
                ip={markerLocation.ip}
            />
            :
            null
        }

        <ReactMapGL
            {...viewport}
            mapStyle={
                darkMode ? 
                    "mapbox://styles/mapbox/dark-v8"
                    :
                    "mapbox://styles/mapbox/light-v8"
            }
            mapboxApiAccessToken={process.env.REACT_APP_TOKEN_MAP}
            maxZoom={20}
            onViewportChange={newViewport => {
                setViewport({ ...newViewport });
            }}
        >
            <Marker
                latitude={markerLocation.latitude}
                longitude={markerLocation.longitude}
            >
                <Pin size={30}/>
            </Marker>
        </ReactMapGL>


        <IconsTheme 
            darkMode={darkMode}
            clickDark={() => setDarkMode(true)}
            clickLight={() => setDarkMode(false)}
        />
        </>
    )
}
