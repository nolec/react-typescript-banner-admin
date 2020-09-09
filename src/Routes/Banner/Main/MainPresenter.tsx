import React, {useContext, useEffect, useState} from 'react';
import BannerLayout from "../../../Components/Banner/Layout";
import InputCard from "../../../Components/Banner/InputCard";
import ReserveComponent from "../../../Components/Banner/ReserveComponent";
import ContentCard from "../../../Components/Banner/ContentCard";
import Context from "../../../Context/context";
import theme from "@saraceninc/saracen-style-ts/lib/theme";
import SS from "@saraceninc/saracen-style-ts";

interface IProps {
    bannerList?: []
    saraStory?: []
    banners: { logo: any, top: any }
}

const MainPresenter: React.FunctionComponent<IProps> = ({saraStory, banners}) => {

    const {beltOpen, setBeltOpen, logoOpen, setLogoOpen, mainBeltOpen, setMainBeltOpen} = useContext(Context)
    return (
        <>
            <BannerLayout
                banner={banners?.top}
                main={true}
                name={"띠 배너"}
                maxWidth={"1150px"} height={"75px"}
                bgColor={banners.top?.color}
                children={
                    <>
                        <SS.Core.Button style={{position: "absolute", top: "0", right: "0"}} padding={"2px"}
                                        theme={theme.blue} onClick={() => setBeltOpen(!beltOpen)}>띠
                            CHANGE</SS.Core.Button>
                        {beltOpen ?
                            <>
                                <InputCard uploadHeight={"75px"}/>
                                <ReserveComponent/>
                            </>
                            :
                            <></>}
                    </>
                }/>
            <BannerLayout
                banner={banners?.logo}
                main={true}
                name={"로고"}
                maxWidth={"250px"} height={"70px"}
                children={
                    <>
                        <SS.Core.Button style={{position: "absolute", top: "0", right: "0"}} padding={"2px"}
                                        theme={theme.blue} onClick={() => setLogoOpen(!logoOpen)}>로고
                            CHANGE</SS.Core.Button>
                        {logoOpen ?
                            <>
                                <InputCard uploadHeight={"70px"}/>
                                <ReserveComponent/>
                            </>
                            :
                            <></>}
                    </>
                }/>
            <BannerLayout
                main={true}
                saraStory={saraStory}
                slider={true}
                name={"메인 배너&미니 배너"}
                maxWidth={"760px"} height={"435px"}
                bgColor={"yellow"}
                margin={"0 0 0 190px"}
                children={
                    <>
                        <SS.Core.Button style={{position: "absolute", top: "0", right: "0"}} padding={"2px"}
                                        margin={"0 0 0 5px"}
                                        theme={theme.blue} onClick={() => setMainBeltOpen(!mainBeltOpen)}>로고
                            CHANGE</SS.Core.Button>

                        {mainBeltOpen ?
                            <>
                                <ContentCard bannerList={saraStory}/>
                                <InputCard uploadHeight={"435px"}/>
                                <ReserveComponent/>
                            </>
                            :
                            <></>}
                    </>
                }/>
        </>
    );
};

export default MainPresenter;