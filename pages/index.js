import Head from 'next/head'
import React,{useState} from "react";
import { useForm } from 'react-hook-form';
import axios from "axios";
import morse from "morse-code-converter";

export default function Home() {
    const {register,handleSubmit,formState: { errors }} = useForm();
    const [reply,setReply] = useState([]);
    const [checksum,setChecksum] = useState([]);
    const [replyData,setReplyData] = useState([]);
    const selectOptions = [
        { value: '-.-. .--. ..-', label: 'CPU' },
        { value: '.- .-. -.-. ....', label: 'ARCH' },
        { value: '..-. .-. . . -- . --', label: 'FREEMEM' },
        { value: '.... --- ... - -. .- -- .', label: 'HOSTNAME' },
        { value: '.--. .-.. .- - ..-. --- .-. --', label: 'PLATFORM' },
        { value: '- --- - .- .-.. -- . --', label: 'TOTALMEM' },
        { value: '- -.-- .--. .', label: 'TYPE' },
        { value: '..- .--. - .. -- .', label: 'UPTIME' }];

    const onSubmit = async (data) => {
        await axios({
            method: 'post',
            url: 'http://ik.olleco.net/morse-api/',
            data: data
        }).then(
            (response) => {
                setReply(response.data)
                setChecksum(response.data.checksum)
                setReplyData(response.data.data)
            }
        ).catch(function (error) {
            console.log(error);
        })
    }
    return (
        <>
            <Head>
                <title>Mors Translate</title>
            </Head>
            <div className="container my-5">
                <div className="row">
                    <div className="col-md-6 mt-4 col-12">
                        <div className="card p-3 shadow-sm">
                            <h4 className="fw-semibold text-decoration-underline">Mors Alfabesi Çeviri Projesi</h4>
                            <p>Lütfen işlem yapmak istediğiniz kelimeyi seçiniz : </p>
                            <div className="col-6">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <select className="form-select form-select-sm"
                                            aria-label="Default select example" {...register("command")}>
                                        <option>Seçim yapınız</option>
                                        {selectOptions.map((item, index) => (
                                            <option value={item.value} key={index}>{item.label}</option>
                                        ))}
                                    </select>
                                    <button type="submit" className="btn btn-primary btn-sm w-50 mt-3">Gönder</button>
                                </form>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-6 mt-4 col-12">
                        {checksum.length!==0 ?
                            (
                                <div className="card p-3 shadow-sm">
                                    {checksum.length!==0 ? (<p><span className="fw-semibold">Checksum:</span>{morse.morseToText(checksum)}</p>) : null}
                                    {
                                        checksum === "-.... --... ....- -.... ..... -.... ---.. ....-" ? (
                                            <>
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th scope="col">Model</th>
                                                        <th scope="col">Speed</th>
                                                        <th scope="col">Times</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        replyData?.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    {morse.morseToText(item.model)}
                                                                </td>
                                                                <td>{
                                                                    morse.morseToText(item.speed)
                                                                }</td>
                                                                <td>
                                                                    <p><span className="fw-semibold">Idle:</span> {morse.morseToText(item.times.idle)}</p>
                                                                    <p><span className="fw-semibold">Irq:</span> {morse.morseToText(item.times.irq)}</p>
                                                                    <p><span className="fw-semibold">Nice:</span> {morse.morseToText(item.times.nice)}</p>
                                                                    <p><span className="fw-semibold">Sys:</span> {morse.morseToText(item.times.sys)}</p>
                                                                    <p><span className="fw-semibold">User:</span> {morse.morseToText(item.times.user)}</p>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                    </tbody>
                                                </table>
                                            </>

                                        ) :(
                                            replyData.length!==0 ? (<p><span className="fw-semibold">Data:</span>{morse.morseToText(replyData)}</p>) : null
                                        )

                                    }
                                </div>
                            ):null}
                    </div>
                </div>



            </div>
        </>
    );
}
