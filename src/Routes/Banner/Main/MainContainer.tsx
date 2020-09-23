import React, {useEffect, useState} from 'react';
import MainPresenter from "./MainPresenter";
import {useQuery} from "@apollo/client";
import {GET_BANNERS_BY_TYPE} from "../../../Graphql";
import {Redirect} from "react-router-dom";

const MainContainer: React.FunctionComponent<any> = ({match: {params: {categoryId, num}}}) => {

        const variables = {type: ["sara_story"], relationId: 0}
        const {data, refetch} = useQuery(GET_BANNERS_BY_TYPE, {
            variables: {typeAndCategoryIdInput: variables}
        })

        const [saraMain, setSaraMain] = useState<any>();
        const [banners, setBanners] = useState({
            logo: {},
            top: {},
        })

        useEffect(() => {
            const compare = (a: any, b: any) => {
                const relationA = a.seq
                const relationB = b.seq
                let comparison = 0;
                if (relationA > relationB) {
                    comparison = 1;
                } else if (relationA < relationB) {
                    comparison = -1;
                }
                return comparison;
            }
            const topAndLogo = data?.getBannerListByGraphAndType?.filter((item: any) => item?.type?.includes('logo') || item.type.includes('top_banner'))
                .sort((a: any, b: any) => {
                    // console.log(a, b)

                    return parseInt(a.id) - parseInt(b.id)
                })
            const storyFilter = data?.getBannerListByGraphAndType?.filter((item: any) => item?.type?.includes("sara_story")).sort(compare)
            console.log(storyFilter)
            if (data?.getBannerListByGraphAndType) {
                setBanners(
                    {...banners, logo: topAndLogo[0], top: topAndLogo[1]}
                )
                setSaraMain(
                    storyFilter
                );
            }

        }, [data?.getBannerListByGraphAndType])
        //
        // if (!num || num > saraMain?.length - 1) {
        //     console.log(num, saraMain?.length)
        //     return <Redirect to={"/"}/>
        // }

        return <MainPresenter saraStory={saraMain} banners={banners} mainBanner={saraMain ? saraMain[parseInt(num)] : []}/>;

    }
;

export default MainContainer;