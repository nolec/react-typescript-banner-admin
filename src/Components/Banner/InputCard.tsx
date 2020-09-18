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
import {ADD_BANNER, UPDATE_BANNER} from "../../Graphql";
import {useMutation} from "@apollo/client";

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
                                                        bannerIndex
                                                    }) => {

        const {
            reserveCheck, handleReserve, filename, files,
            formData, setFormData,
            initialValues, setValueData,
            key, setKey
        } = useContext(Context);
        const keyArray: string[] = Object.keys(banner);

        const [flash, setFlash] = useState(false);

        let ContactFormSchema = yup.object().shape({
            img: yup.string().nullable(true),
            backImg: yup.string().nullable(true),
            backImgPos: yup.string().nullable(true),
            url: yup.string().nullable(true),
            alt: yup.string().nullable(true),
            mainCopy: yup.string().nullable(true),
            subCopy: yup.string().nullable(true),
            color: yup.string().nullable(true),
            seq: yup.number().min(0, "숫자를 채워주세요").nullable(true),
        })

        //TODO input 데이타들이 업데이트 될 때 함수 발동
        const valueChange = (e: any, setFieldValue: Function) => {
            const {target: {name}} = e;
            const {target: {value}} = e;
            console.log("에바")
            if (initialValues) {
                setValueData({
                    [key as keyof IBanners]: {
                        ...initialValues[key as keyof IBanners],
                        [name]: value
                    }
                })
                setFieldValue(name, value)
            }
        }
        //TODO input 데이타들이 업데이트 될 때 함수 발동


        //TODO Filename이 업데이트 되었다면 initialValues를 업데이트 해준다.
        const imgValueSetting = (field: string, setFieldValue: Function) => {
            console.log(initialValues, field, filename, "----이름 세팅")
            if (initialValues) {
                setValueData({
                    [key as keyof IBanners]: {
                        ...initialValues[key as keyof IBanners],
                        [field]: filename[field] ? filename[field] : initialValues?.[key as keyof IBanners]?.[field as keyof IBanner]
                    }
                })
                setFieldValue(field, filename)
            }
        }
        //TODO Filename이 업데이트 되었다면 initialValues를 업데이트 해준다.


        useEffect(() => {
            if (reserveCheck) {
                handleReserve(false)
            }
            if (banner) {
                setKey(keyArray[0]);
                console.log(banner[keyArray[0] as keyof IBanners])
                setValueData({
                        ...initialValues,
                        [keyArray[0]]: banner[keyArray[0] as keyof IBanners]
                    }
                )
            }
        }, [bannerIndex])
        const [updateBanner, {data, loading}] = useMutation(UPDATE_BANNER)

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
                        onSubmit={
                            async (values, actions: FormikHelpers<any>) => {
                                console.log(values, files)
                                if (reserveCheck) {
                                    setFlash(true)
                                    setTimeout(() => {
                                        setFlash(false)
                                    }, [3000])
                                    return false
                                }
                                //
                                // setFormData({
                                //     ...formData, ...values,
                                //     file: files[0]
                                // });
                                // await updateBanner({
                                //     variables: {
                                //         bannerUpdateData: {
                                //             ...values,
                                //             relationId: values?.relationId,
                                //             type: values?.type
                                //         },
                                //         id: bannerIndex
                                //     }
                                // })
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
                                        imgPath={`${banner[key as keyof IBanners]?.relationId}/${banner[key as keyof IBanners]?.img}`}
                                        name={"사진"} whichImg={'img'}
                                        uploadHeight={uploadHeight}/>
                                    {logo ? <DropzoneComponent
                                        imgPath={`${banner[key as keyof IBanners]?.relationId}/${banner[key as keyof IBanners]?.backImg}`}
                                        name={"배경"} whichImg={'backImg'}
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
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues?.[key as keyof IBanners]?.backImgPos || '' : ''}
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
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues[key as keyof IBanners]?.alt || '' : ""}
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
                                                value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues[key as keyof IBanners]?.color || '' : ""}
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
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues[key as keyof IBanners]?.mainCopy || '' : ""}
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
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues[key as keyof IBanners]?.subCopy || '' : ""}
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
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues[key as keyof IBanners]?.color || '' : ""}
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
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues[key as keyof IBanners]?.seq || '' : ""}
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
                                                value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues[key as keyof IBanners]?.url || '' : ""}
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
                                            value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues[key as keyof IBanners]?.img || '' : ""}
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
                                                    value={bannerIndex === initialValues?.[key as keyof IBanners]?.id ? initialValues[key as keyof IBanners]?.backImg || '' : ""}
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
                                                                        margin={"0 20px 0 5px"}>{`날짜`}</SS.Core.Span>
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