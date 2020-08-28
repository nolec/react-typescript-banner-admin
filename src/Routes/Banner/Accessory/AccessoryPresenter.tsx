import React from 'react';
import BannerLayout from "../../../Components/Banner/Layout";
import InputCard from "../../../Components/Banner/InputCard";
import ReserveComponent from "../../../Components/Banner/ReserveComponent";
import ContentCard from "../../../Components/Banner/ContentCard";

const AccessoryPresenter: React.FunctionComponent = () => {
    return (
        <BannerLayout name={"악세서리"} imgBoxWidth={"fit-content"} height={"435px"} children={
            <>
                <ContentCard/>
                <InputCard uploadHeight={"435px"}/>
                <ReserveComponent/>
            </>
        }/>
    );
};

export default AccessoryPresenter;