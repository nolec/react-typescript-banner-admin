import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import SS from "@saraceninc/saracen-style-ts";
import styled from "styled-components";
import {TextField, Button} from "@material-ui/core"
import {
    Formik,
    Form,
    FormikHelpers
} from "formik"
import * as yup from "yup";
import DropzoneComponent from "./DropzoneComponent";
import {styled as styledMaterial} from "@material-ui/core/styles";
import Context from "../../Context/context";
import Alert from "@material-ui/lab/Alert"
import {ADD_BANNER, ADD_RESERVEDBANNER, GET_BANNERS_ASIWANT, UPDATE_BANNER} from "../../Graphql";
import {ApolloCache, useMutation} from "@apollo/client";
import moment from "moment";
import {generateRandom} from "./ContentCard";

const styles: any = {
    alert: {
        left: '0',
        pointerEvents: 'none',
        position: 'relative',
        margin: "10px 0 0 0",
        top: 0,
        width: '100%',
    }
}

const Col = styled(SS.Core.Col)`
box-shadow: 0 2px 0 rgba(90,97,105,.11), 0 4px 8px rgba(90,97,105,.12), 0 10px 10px rgba(90,97,105,.06), 0 7px 70px rgba(90,97,105,.1);
padding: 10px 10px;
display: flex;
`;
const FormUpload = styled(Form)`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 100%;
  }
`;
const Group = styledMaterial(TextField)(({theme}) => ({
    padding: theme.spacing(0)
}));

export interface IBanner {
    id?: number,
    relationId?: number,
    img?: string,
    type?: string,
    url?: string,
    alt?: string,
    color?: string,
    seq?: number,
    subCopy?: string,
    mainCopy?: string,
    backImgPos?: string,
    backImg?: string,
    adminId?: number
    updatedAt?: string
    reservedBanners?: []
}

export interface IBanners {
    story?: IBanner,
    logo?: IBanner,
    top?: IBanner,
    accessory?: IBanner,
    care?: IBanner,
    hair?: IBanner,
    nailArt?: IBanner,
    interior?: IBanner,
    makeUp?: IBanner,
    massage?: IBanner
    appLoading?: IBanner
    ads?: IBanner
    // [key: string]: IBanner;
}

interface IProps {
    bannerIndex?: number
    uploadHeight?: string
    banner: IBanners
    story?: boolean
    logo?: boolean
    top?: boolean
    variables?: any
}

interface Values {
    backImg?: string;
    type?: string;
    relationId?: number;
    adminId?: number;
    img?: string;
    url?: string;
    mainCopy?: string;
    subCopy?: string;
    color?: string;
    seq?: number;
    alt?: string;
    backImgPos?: string

}


const InputCard: React.FunctionComponent<IProps> = ({
                                                        uploadHeight,
                                                        banner,
                                                        story,
                                                        logo,
                                                        top,
                                                        bannerIndex,
                                                        variables
                                                    }) => {

        const {
            reserveCheck, handleReserve, filename, files,
            formData, setFormData,
            initialValues, setValueData,
            key, setKey,
            startDate
        } = useContext(Context);

        const [createBanner, {data}] = useMutation(ADD_BANNER, {
            update(cache: ApolloCache<any>, {data: {addBannerByGraph}}) {
                const {getNewBanners}: any = cache.readQuery({
                    query: GET_BANNERS_ASIWANT,
                    variables
                });
                console.log(getNewBanners, addBannerByGraph)
                cache.writeQuery({
                    query: GET_BANNERS_ASIWANT,
                    variables,
                    data: {getNewBanners: getNewBanners.concat([addBannerByGraph])}
                })
            }
        });
        const [updateBanner, {data: updateResult, loading}] = useMutation(UPDATE_BANNER, {
            update(cache: ApolloCache<any>, {data: {updateBannerByGraph}}) {
                console.log(variables)
                const {getNewBanners}: any = cache.readQuery({
                    query: GET_BANNERS_ASIWANT,
                    variables
                });
                const newBanners = getNewBanners.map((item: any) => item.id === updateBannerByGraph ? item = updateBannerByGraph : item)
                cache.writeQuery({
                    query: GET_BANNERS_ASIWANT,
                    variables,
                    data: {getNewBanners: newBanners}
                })
                if (updateBannerByGraph) {
                    setUpdatedAt(updateBannerByGraph?.updatedAt);
                    alert("업데이트 완료")
                }
            }
        })

        const [addReservedBanner, {data: addReservedResult}] = useMutation(ADD_RESERVEDBANNER,{
            update(cache: ApolloCache<any>, {data: {updateBannerByGraph}}) {
                console.log(variables)
                const {getNewBanners}: any = cache.readQuery({
                    query: GET_BANNERS_ASIWANT,
                    variables
                });
                const newBanners = getNewBanners.map((item: any) => item.id === updateBannerByGraph ? item = updateBannerByGraph : item)
                cache.writeQuery({
                    query: GET_BANNERS_ASIWANT,
                    variables,
                    data: {getNewBanners: newBanners}
                })
                if (updateBannerByGraph) {
                    setUpdatedAt(updateBannerByGraph?.updatedAt);
                    alert("업데이트 완료")
                }
            }
        })

        const keyArray: string[] = Object.keys(banner);

        const [updatedAt, setUpdatedAt] = useState<string>();

        const [flash, setFlash] = useState(false);

        const [path, setPath] = useState<string>();

        let ContactFormSchema = yup.object().shape({
            img: yup.string().nullable(true),
            backImg: yup.string().nullable(true),
            backImgPos: yup.string().nullable(true),
            url: yup.string().nullable(true),
            alt: yup.string().nullable(true),
            mainCopy: yup.string().nullable(true),
            subCopy: yup.string().nullable(true),
            color: yup.string().nullable(true),
            seq: yup.number().min(0, "숫자를 채워주세요").max(100, "100을 넘길 수 없습니다.").nullable(false).required("채워주세요"),
        })

//TODO input 데이타들이 업데이트 될 때 함수 발동
        const valueChange = (e: any, setFieldValue: Function) => {
            const {target: {name}} = e;
            const {target: {value}} = e;

            setValueData({
                [key as keyof IBanners]: {
                    ...initialValues[key as keyof IBanners],
                    [name]: value
                }
            })
            setFieldValue(name, value)
        }
//TODO input 데이타들이 업데이트 될 때 함수 발동

        const valueSubmit = async (values: Values) => {

            let obj: any = {
                adminId: 0,
                relationId: banner[key as keyof IBanners]?.relationId
            };
            const id: string | undefined = bannerIndex?.toString();

            if (id) {
                Object.keys(values).forEach(k => {
                    if (initialValues[key][k]) {
                        let valueData = initialValues[key][k];
                        if (k === "seq") {
                            valueData = parseInt(valueData)
                        }
                        obj[k] = valueData;
                    }
                });
                await updateBanner({
                    variables: {
                        bannerUpdateData: obj,
                        id: parseInt(id as string)
                    }
                })
                if (reserveCheck && startDate) {
                    obj.reservationDate = Date.parse(startDate);
                    await addReservedBanner({
                        variables: {
                            reservedBannerData: obj
                        }
                    })
                }
            } else {
                Object.keys(values).forEach(k => {
                    let valueData = initialValues[key][k];
                    if (k === "seq") {
                        valueData = parseInt(valueData)
                        if (!valueData) {
                            valueData = 99
                        }
                    }
                    obj[k] = valueData;
                });
                obj.type = variables.typeAndCategoryIdInput.type[0]
                obj.adminId = 0;
                obj.relationId = variables.typeAndCategoryIdInput.relationId === 0 ? generateRandom(0, 100000) : variables.typeAndCategoryIdInput.relationId
                console.log("여기는 추가 :", initialValues, obj, variables)
                await createBanner({
                    variables: {
                        bannerData: obj
                    }
                })
                if (reserveCheck && startDate) {
                    obj.reservationDate = Date.parse(startDate);
                    await addReservedBanner({
                        variables: {
                            reservedBannerData: obj
                        }
                    })
                }
            }

        }

//TODO Filename이 업데이트 되었다면 initialValues를 업데이트 해준다.
        const imgValueSetting = (field: string, setFieldValue: Function) => {
            console.log(initialValues, field, filename, "----이름 세팅")
            if (initialValues) {
                setValueData({
                    ...initialValues,
                    [field]: filename[field] ? filename[field] : initialValues?.[field as keyof IBanner]
                })
                setFieldValue(field, filename)
            }
        }
//TODO Filename이 업데이트 되었다면 initialValues를 업데이트 해준다.


        useEffect(() => {
            if (banner) {
                setKey(keyArray[0]);
                setValueData({
                        ...initialValues,
                        [keyArray[0]]: banner[keyArray[0] as keyof IBanners]
                    }
                )
            }
            if (reserveCheck) {
                handleReserve(false)
            }
            console.log(banner)
            setUpdatedAt(banner?.[keyArray[0] as keyof IBanners]?.updatedAt)
        }, [bannerIndex])

        return (
            <SS.Core.Row>
                <Col className={"formik"}>
                    <Formik
                        initialValues={{
                            backImg: banner[keyArray[0] as keyof IBanners]?.backImg,
                            type: banner[keyArray[0] as keyof IBanners]?.type,
                            relationId: banner[keyArray[0] as keyof IBanners]?.relationId,
                            adminId: banner[keyArray[0] as keyof IBanners]?.adminId,
                            img: banner[keyArray[0] as keyof IBanners]?.img,
                            url: banner[keyArray[0] as keyof IBanners]?.url,
                            mainCopy: banner[keyArray[0] as keyof IBanners]?.mainCopy,
                            subCopy: banner[keyArray[0] as keyof IBanners]?.subCopy,
                            color: banner[keyArray[0] as keyof IBanners]?.color,
                            seq: banner[keyArray[0] as keyof IBanners]?.seq,
                            alt: banner[keyArray[0] as keyof IBanners]?.alt,
                            backImgPos: banner[keyArray[0] as keyof IBanners]?.backImgPos
                        }}
                        validationSchema={ContactFormSchema}
                        onSubmit={async (values: Values) => {
                            console.log(values)
                            if (reserveCheck && startDate === null) {
                                setFlash(true)
                                setTimeout(() => {
                                    setFlash(false)
                                }, [3000])
                                return false
                            }

                            await valueSubmit(values);
                            setFormData({
                                ...formData, ...values,
                                file: files[0]
                            });
                        }
                        }
                    >
                        {
                            ({
                                 errors,
                                 handleChange,
                                 touched,
                                 setFieldValue,
                             }: any) => (
                                <>
                                    <DropzoneComponent
                                        imgPath={
                                            key === 'appLoading' ?
                                                `${process.env.REACT_APP_ACTIVE_IMG}img/app/splash/${banner?.[keyArray[0] as keyof IBanners]?.img}`
                                                :
                                                `${process.env.REACT_APP_SARACEN_IMG}img/banner/image/${banner?.[key as keyof IBanners]?.relationId}/${banner?.[key as keyof IBanners]?.img}`

                                        }
                                        bannerIndex={bannerIndex?.toString()}
                                        name={"사진"} whichImg={'img'}
                                        story={story}
                                        uploadHeight={uploadHeight}/>
                                    {logo ? <DropzoneComponent
                                        imgPath={
                                            key === 'appLoading' ?
                                                `${process.env.REACT_APP_ACTIVE_IMG}img/app/splash/${banner?.[keyArray[0] as keyof IBanners]?.backImg}`
                                                :
                                                `${process.env.REACT_APP_SARACEN_IMG}img/banner/image/${banner?.[key as keyof IBanners]?.relationId}/${banner?.[key as keyof IBanners]?.backImg}`
                                        }
                                        name={"배경"} whichImg={'backImg'}
                                        story={story}
                                        uploadHeight={uploadHeight}/> : <></>}
                                    <FormUpload>
                                        {
                                            logo ?
                                                <Group
                                                    margin={"dense"}
                                                    error={errors?.backImgPos && touched?.backImgPos}
                                                    onChange={(e) => valueChange(e, setFieldValue)}
                                                    // onChange={(e) => handleChange(e)}
                                                    autoComplete="backImgPos"
                                                    name="backImgPos"
                                                    variant="outlined"
                                                    value={initialValues?.[keyArray[0] as keyof IBanners]?.id ? initialValues?.[keyArray[0] as keyof IBanners]?.backImgPos || '' : ''}
                                                    id="backImgPos"
                                                    label="위치"
                                                    placeholder="박스 위치를 설정하여 주십시오."
                                                    color={"secondary"}
                                                    helperText={
                                                        errors?.backImgPos && touched?.backImgPos
                                                            ? errors?.backImgPos
                                                            : null
                                                    }
                                                />
                                                : banner.appLoading ? <></> :
                                                <Group
                                                    margin={"dense"}
                                                    error={errors?.alt && touched?.alt}
                                                    onChange={(e) => valueChange(e, setFieldValue)}
                                                    // onChange={handleChange}
                                                    autoComplete="alt"
                                                    name="alt"
                                                    variant="outlined"
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.alt || '' : ""}
                                                    id="alt"
                                                    label="제목"
                                                    color={"secondary"}
                                                    helperText={
                                                        errors?.alt && touched?.alt
                                                            ? errors?.alt
                                                            : null
                                                    }
                                                />
                                        }
                                        {top ?
                                            <Group
                                                margin={"dense"}
                                                error={errors?.color && touched?.color}
                                                onChange={(e) => valueChange(e, setFieldValue)}
                                                // onChange={handleChange}
                                                autoComplete="color"
                                                name="color"
                                                variant="outlined"
                                                value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.color || '' : ""}
                                                id="color"
                                                label="배경색"
                                                color={"secondary"}
                                                helperText={
                                                    errors?.color && touched?.color
                                                        ? errors?.color
                                                        : null
                                                }
                                            />
                                            : <></>}
                                        {story ?
                                            <>
                                                <Group
                                                    margin={"dense"}
                                                    error={errors?.mainCopy && touched?.mainCopy}
                                                    onChange={(e) => valueChange(e, setFieldValue)}
                                                    // onChange={handleChange}
                                                    autoComplete="mainCopy"
                                                    name="mainCopy"
                                                    variant="outlined"
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.mainCopy || '' : ""}
                                                    id="mainCopy"
                                                    label="메인카피"
                                                    color={"secondary"}
                                                    helperText={
                                                        errors?.mainCopy && touched?.mainCopy
                                                            ? errors?.mainCopy
                                                            : null
                                                    }
                                                />
                                                <Group
                                                    margin={"dense"}
                                                    error={errors?.subCopy && touched?.subCopy}
                                                    onChange={(e) => valueChange(e, setFieldValue)}
                                                    // onChange={handleChange}
                                                    autoComplete="subCopy"
                                                    name="subCopy"
                                                    variant="outlined"
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.subCopy || '' : ""}
                                                    id="subCopy"
                                                    label="서브카피"
                                                    color={"secondary"}
                                                    helperText={
                                                        errors?.subCopy && touched?.subCopy
                                                            ? errors?.subCopy
                                                            : null
                                                    }
                                                />
                                                <Group
                                                    margin={"dense"}
                                                    error={errors?.color && touched?.color}
                                                    onChange={(e) => valueChange(e, setFieldValue)}
                                                    // onChange={handleChange}
                                                    autoComplete="color"
                                                    name="color"
                                                    variant="outlined"
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.color || '' : ""}
                                                    id="color"
                                                    label="배경색"
                                                    color={"secondary"}
                                                    helperText={
                                                        errors?.color && touched?.color
                                                            ? errors?.color
                                                            : null
                                                    }
                                                />
                                                <Group
                                                    margin={"dense"}
                                                    error={errors?.seq && touched?.seq}
                                                    onChange={(e) => valueChange(e, setFieldValue)}
                                                    // onChange={handleChange}
                                                    autoComplete="seq"
                                                    name="seq"
                                                    variant="outlined"
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.seq || 0 : 0}
                                                    id="seq"
                                                    label="순서"
                                                    color={"secondary"}
                                                    helperText={
                                                        errors?.seq && touched?.seq
                                                            ? errors?.seq
                                                            : null
                                                    }
                                                />

                                            </>
                                            : <></>
                                        }
                                        {banner.appLoading ? <></> :
                                            <Group
                                                margin={"dense"}
                                                error={errors?.url && touched?.url}
                                                onChange={(e) => valueChange(e, setFieldValue)}
                                                // onChange={handleChange}
                                                autoComplete="url"
                                                name="url"
                                                variant="outlined"
                                                value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.url || '' : ""}
                                                id="url"
                                                label="링크"
                                                color={"secondary"}
                                                helperText={
                                                    errors?.url && touched?.url
                                                        ? errors?.url
                                                        : null
                                                }
                                            />}
                                        <Group
                                            margin={"dense"}
                                            error={errors?.img && touched?.img}
                                            autoComplete="img"
                                            onBlur={() => imgValueSetting("img", setFieldValue)}
                                            name="img"
                                            variant="outlined"
                                            id="img"
                                            placeholder="위 박스를 클릭하여 사진 이미지를 올려주세요."
                                            label={"사진 이미지"}
                                            value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.img || '' : ""}
                                            disabled={true}
                                            color={"secondary"}
                                            helperText={
                                                errors?.img && touched?.img
                                                    ? errors?.img
                                                    : null
                                            }
                                        />
                                        {logo ?
                                            <>
                                                <Group
                                                    margin={"dense"}
                                                    error={errors?.backImg && touched?.backImg}
                                                    autoComplete="backImg"
                                                    onBlur={() => imgValueSetting("backImg", setFieldValue)}
                                                    name="backImg"
                                                    variant="outlined"
                                                    id="backImg"
                                                    placeholder="위 박스를 클릭하여 배경이미지를 올려주세요."
                                                    label={"배경 이미지"}
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.backImg || '' : ""}
                                                    disabled={true}
                                                    color={"secondary"}
                                                    helperText={
                                                        errors?.backImg && touched?.backImg
                                                            ? errors?.backImg
                                                            : null
                                                    }
                                                />
                                            </>
                                            : <></>}
                                        <SS.Core.RowF>
                                            <Button
                                                type="submit"
                                                color="primary"
                                                variant="contained"
                                                style={{alignSelf: "center"}}
                                            >
                                                SAVE
                                            </Button>
                                            <SS.Core.InputRow
                                                style={{border: `none`, backgroundColor: "transparent", margin: "0 10px"}}
                                                width={"fit-content"}>
                                                <SS.Core.Input style={{position: "unset"}} id={"reserve"} type={"checkBox"}
                                                               checked={reserveCheck} onChange={handleReserve}/>
                                                <label style={{padding: "5px"}} htmlFor={"reserve"}>예약</label>
                                            </SS.Core.InputRow>
                                            <SS.Core.Text display={"flex"} alignItems={"center"} flex={"1"}
                                                          justifyContent={"flex-end"}>
                                                마지막 수정일 : <SS.Core.Span fontSize={"transparent"}
                                                                        margin={"0 20px 0 5px"}>{moment(updatedAt).format('YYYY.MM.DD h:mm a')}</SS.Core.Span>
                                                마지막 수정자 : <SS.Core.Span fontSize={"transparent"}
                                                                        margin={"0 0 0 5px"}>{`김승석`}</SS.Core.Span>
                                            </SS.Core.Text>
                                        </SS.Core.RowF>
                                        {flash ?
                                            <Alert style={styles.alert} severity="error">예약 시간을 설정하여 주십시오.</Alert> : null}
                                    </FormUpload>
                                </>
                            )
                        }
                    </Formik>
                </Col>
            </SS.Core.Row>
        );
    }
;
export default InputCard;