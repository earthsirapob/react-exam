import React, { useState, useEffect } from 'react'
import { connect, useStore  } from 'react-redux'
import { Form, Row, Col, Input, Button, Select, Radio, DatePicker, Table, Space } from 'antd'
import moment from 'moment'

const { Option } = Select
const { Column } = Table;
const RadioGroup = Radio.Group

const ApplicationForm = ({userData, dispatch, userCount}) => {
  const [citizenId, setCitizenId] = useState('');
  const [selectedRow, setSelectedRow] = useState('')
  const [editable, setEditable] = useState(Boolean)
  const [keyVal, setKeyVal] = useState('')
  const [form] = Form.useForm();
  const store = useStore()
  
  useEffect(() => {
    if(JSON.parse(localStorage.getItem('userData'))) {
      let getUserData = JSON.parse(localStorage.getItem('userData'))
      let getUserCount = parseInt(localStorage.getItem('userCount'))
      dispatch(updateUserData(getUserData))
      dispatch(updateUserCount(getUserCount))
    }

  },[])

  const addUserData = (userData) => ({
    type: 'ADD_USER_DATA',
    userData
  })
  const updateUserData = (userData) => ({
    type: 'UPDATE_USER_DATA',
    userData
  })
  const updateUserCount = (userCount) => ({
    type: 'UPDATE_USER_COUNT',
    userCount
  })
  const deleteUserData = (userData) => ({
    type: 'DELETE_USER_DATA',
    userData
  })
  const deleteSelectedData = (userData) => ({
    type: 'DELETE_SELECT_DATA',
    userData
  })

  
  form.setFieldsValue({
    [`citizenId`]: citizenId
  });

  const handleChange = async(e) => {
    const { maxLength, value, name } = e.target;
    const [fieldName, fieldIndex] = name.split("-");
    const firstSec = document.querySelector(
      `input[name=citizen-1]`
    );
    const secondSec = document.querySelector(
      `input[name=citizen-2]`
    );
    const thirdSec = document.querySelector(
      `input[name=citizen-3`
    );
    const fourthSec = document.querySelector(
      `input[name=citizen-4]`
    );
    const lastSec = document.querySelector(
      `input[name=citizen-5]`
    );
    setCitizenId(firstSec.value + secondSec.value + thirdSec.value + fourthSec.value + lastSec.value)
    
    if(value.length === 0) {
      const prevSibling = document.querySelector(
        `input[name=citizen-${parseInt(fieldIndex, 10) - 1}]`
      );
      if (prevSibling !== null) {
        prevSibling.focus();
      }
    }
    
    if (value.length >= maxLength) {
      // Check if it's not the last input field
      if (parseInt(fieldIndex, 10) < 5) {
        // Get the next input field
        const nextSibling = document.querySelector(
          `input[name=citizen-${parseInt(fieldIndex, 10) + 1}]`
        );

        // If found, focus the next field
        if (nextSibling !== null) {
          nextSibling.focus();
        }
      }
    }

  }

  const onFinish = (results) => {
    if(editable) {
      for(let i = 0;i < userData.length; i++) {
        if(keyVal === userData[i].key) {
          let tmp_userData = {
            key: keyVal,
            title : results.title,
            firstname: results.firstname,
            lastname: results.lastname,
            name : results.firstname + " " + results.lastname,
            birthdate : results.birthdate,
            nationality : results.nationality,
            citizenId : results.citizenId,
            gender : results.gender,
            phoneNoPrefix : results.phoneNo,
            phoneNo : results.prefix + results.phoneNo,
            passportNo : results.passportNo,
            extSaraly : results.extSaraly
          }
          userData.splice(i, 1)
          userData.splice(i, 0, tmp_userData)
          dispatch(deleteUserData(i))
          localStorage.setItem('userData', JSON.stringify(store.getState().userData))
        }
      }
      form.resetFields();
      setEditable(false)
    } else {
      let tmp_count = userCount + 1
  
      let tmp_userData = {
        key: tmp_count,
        title : results.title,
        firstname: results.firstname,
        lastname: results.lastname,
        name : results.firstname + " " + results.lastname,
        birthdate : results.birthdate,
        nationality : results.nationality,
        citizenId : results.citizenId,
        gender : results.gender,
        phoneNoPrefix : results.phoneNo,
        phoneNo : results.prefix + results.phoneNo,
        passportNo : results.passportNo,
        extSaraly : results.extSaraly
      }
  
      dispatch(addUserData(tmp_userData))
      localStorage.setItem('userCount', userCount + 1)
      localStorage.setItem('userData', JSON.stringify(store.getState().userData))
  
      form.resetFields();

    }
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRows)
    }
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="+66">
      <Select style={{ width: 100 }}>
        <Option value="+66"><img src="http://purecatamphetamine.github.io/country-flag-icons/3x2/TH.svg" style={{width: '26px'}}></img><span>&nbsp;+66</span></Option>
        <Option value="+1"><img src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg" style={{width: '26px'}}></img><span>&nbsp;+1</span></Option>
        <Option value="+856"><img src="https://cdn.countryflags.com/thumbs/laos/flag-800.png" style={{width: '26px'}}></img><span>&nbsp;+856</span></Option>
      </Select>
    </Form.Item>
  )

  const onDelete = async(e) => {
    for(let i = 0; i < userData.length; i++) {
      if(userData[i].key === e.key) {
        userData.splice(i, 1)
        dispatch(deleteUserData(i))
        localStorage.setItem('userData', JSON.stringify(store.getState().userData))
      }
    }
  }
  
  const onClearCancel = (e) => {
    if(editable) {
      form.resetFields();
      setEditable(false)
    } else {
      form.resetFields();
    }

  }
  const onEdit = async(e) => {
    for (let i = 0; i < userData.length; i++) {
      if(userData[i].key === e.key) {
        await setEditable(true)
        await setKeyVal(e.key)
        form.setFieldsValue({title : userData[i].title})
        form.setFieldsValue({firstname : userData[i].firstname})
        form.setFieldsValue({lastname : userData[i].lastname})
        form.setFieldsValue({birthdate : moment(userData[i].birthdate, "YYYY-MM-DD")})
        form.setFieldsValue({nationality : userData[i].nationality})
        form.setFieldsValue({[`citizenId`]: userData[i].citizenId});
        document.querySelector(`input[name=citizen-1]`).value = userData[i].citizenId.substring(0,1)
        document.querySelector(`input[name=citizen-2]`).value = userData[i].citizenId.substring(1,5)
        document.querySelector(`input[name=citizen-3]`).value = userData[i].citizenId.substring(5,9)
        document.querySelector(`input[name=citizen-4]`).value = userData[i].citizenId.substring(9,12)
        document.querySelector(`input[name=citizen-5]`).value = userData[i].citizenId.substring(12,13)
        form.setFieldsValue({gender : userData[i].gender})
        form.setFieldsValue({phoneNo : userData[i].phoneNoPrefix})
        form.setFieldsValue({passportNo : userData[i].passportNo})
        form.setFieldsValue({extSaraly : userData[i].extSaraly})
        
      }
    }
  }

  const deleteSelected = async() => {
    if(selectedRow.length === 0) {
      alert("Please check at least 1 box.")
    } else if (selectedRow.length > 0) {
      await setSelectedRow([])
      var result = userData.filter((user) => selectedRow.every((selected) => selected.key !== user.key));
      dispatch(deleteSelectedData(result))
      localStorage.setItem('userData', JSON.stringify(store.getState().userData))
    }
  }
  const deleteAll = () => {
    userData.length = 0
    dispatch(deleteUserData())
    localStorage.setItem('userData', JSON.stringify(store.getState().userData))
  }

  return (
    <div className="container-page">
    <div className="wrapper">
      <div className="form">
      <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={24}>

      <Col xs={24} sm={24} md={6} lg={8} xl={4} key={1}>
          <Form.Item
            id='titleja'
            initialValue = "Mr."
            name={`title`}
            label={`Title :`}
            rules={[
              {
                required: true,
                message: 'Select title.',
              },
            ]}
          >
          <Select id="title">
            <Option value="Mr.">Mr.</Option>
            <Option value="Ms.">Ms.</Option>
            <Option value="Mrs.">Mrs.</Option>
          </Select>
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={9} lg={8} xl={10} key={2}>
          <Form.Item
            name={`firstname`}
            label={`First name :`}
            rules={[
              {
                required: true,
                message: 'Please fill your first name.'
              },
            ]}
          >
          <Input id="firstname" placeholder="Fill your first name." />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={9} lg={8} xl={10} key={3}>
          <Form.Item
            name={`lastname`}
            label={`Last name :`}
            rules={[
              {
                required: true,
                message: 'Please fill your last name.'
              },
            ]}
          >
          <Input id="lastname" placeholder="Fill your last name." />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={9} lg={9} key={4}>
          <Form.Item
            name={`birthdate`}
            label={`Birthday :`}
            rules={[
              {
                required: true,
                message: 'Select your birth date.',
              },
            ]}
            
          >
          <DatePicker id="birthdate" format="ll" />
        </Form.Item>
      </Col>
      <Col span={1}>
      </Col>
      <Col xs={24} sm={24} md={14} lg={14} key={5}>
          <Form.Item
            name={`nationality`}
            label={`Nationality :`}
          >
          <Select id="nationality" placeholder="Please select a country">
            <Option value="Thailand"><img src="http://purecatamphetamine.github.io/country-flag-icons/3x2/TH.svg" style={{width: '26px'}}></img><span>&nbsp;Thailand</span></Option>
            <Option value="American"><img src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg" style={{width: '26px'}}></img><span>&nbsp;American</span></Option>
            <Option value="Laos"><img src="https://cdn.countryflags.com/thumbs/laos/flag-800.png" style={{width: '26px'}}></img><span>&nbsp;Laos</span></Option>
          </Select>
        </Form.Item>
      </Col>
      </Row>
      <Row>  
      <Col xs={24} sm={24} md={16} lg={12} xl={10} key={6}>
          <Form.Item
            name={`citizenId`}
            label={`Citizen ID :`}
            rules={[
              {
                len : 13,
                required: true,
                message: 'Citizen ID have 13 characters.',
              },
            ]}
          >
          <Input name="citizen-1" style={{ width: '11%', textAlign: 'center' }} maxLength="1"
            onChange={handleChange} />
          <span>&nbsp;-&nbsp;</span>
          <Input name="citizen-2" style={{ width: '20%', textAlign: 'center'  }} maxLength="4" 
            onChange={handleChange} />
          <span>&nbsp;-&nbsp;</span>
          <Input name="citizen-3" style={{ width: '20%', textAlign: 'center'  }} maxLength="4"  
            onChange={handleChange}/>
          <span>&nbsp;-&nbsp;</span>
          <Input name="citizen-4" style={{ width: '17%', textAlign: 'center'  }} maxLength="3" 
            onChange={handleChange} />
          <span>&nbsp;-&nbsp;</span>
          <Input name="citizen-5" style={{ width: '11%', textAlign: 'center'  }} maxLength="1"
            onChange={handleChange} />
        </Form.Item>
      </Col>
      </Row>
      <Row>  
      <Col span={24} key={7}>
          <Form.Item
            name={`gender`}
            label={`Gender :`}
          >
            <RadioGroup id="gender">
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
              <Radio value="Unisex">Unisex</Radio>
            </RadioGroup>
        </Form.Item>
      </Col>
      </Row>
      <Row>  
      <Col xs={24} sm={24} md={14} lg={10} key={8}>
          <Form.Item
            name={`phoneNo`}
            label={`Mobile Phone :`}
            rules={[
              {
                // type: 'number',
                required: true,
                message: 'Please fill your phone number.',
              },
            ]}
          >
          <Input id="phoneNo" addonBefore={prefixSelector}/>
            
        </Form.Item>
      </Col>
      </Row>
      <Row>

      <Col xs={24} sm={24} md={14} lg={10} key={9}>
          <Form.Item
            name={`passportNo`}
            label={`Passport No. :`}
          >
          <Input id="passportNo" placeholder="Passport No."/>
        </Form.Item>
      </Col>
      </Row>
      <Row>

      <Col xs={24} sm={24} md={14} lg={10} key={10}>
          <Form.Item
            name={`extSaraly`}
            label={`Expected salary :`}
            rules={[
              {
                required: true,
                message: 'Please fill your expected salary.',
              },
            ]}
            
          >
          <Input id="extSalary" addonAfter={"THB"} placeholder="Amount"/>
          
        </Form.Item>
      </Col>
      <Col xs={1} sm={1} md={4} lg={8} key={11}>
      </Col>
      <Col xs={23} sm={24} md={6} lg={6} key={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button type="primary" htmlType="submit">
            {editable ? 'EDIT' : 'SUBMIT'}
          </Button>
          <Button
            style={{ margin: '0 8px' }}
            onClick={onClearCancel}
          >
            {editable ? 'CANCEL' : 'CLEAR'}
          </Button>
      </Col>
      </Row>
    </Form>
      </div>

    </div>
    <Button style={{marginBottom:'20px', marginRight: '20px'}} danger size="medium" onClick={deleteSelected}>DELETE SELECTED ITEMS</Button>
    <Button style={{marginBottom:'20px'}} type="primary" danger size="medium" onClick={deleteAll}>DELETE ALL</Button>
      <Table dataSource={userData} 
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
          
        }}
        bordered
        pagination={{
          size: "medium",
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "30"]
        }}>
          <Column title="Name" dataIndex="name" key="name" />
          <Column title="Gender" dataIndex="gender" key="gender" />
          <Column title="Mobile Phone" dataIndex="phoneNo" key="phoneNo" />
          <Column title="Nationality" dataIndex="nationality" key="nationality" />
          <Column
            key="action"
            render={(rows) => (
              <Space size="middle">
                <a onClick={() => onEdit(rows)}  type="edit">Edit</a>
                /
                <a onClick={() => onDelete(rows)} type="delete">Delete</a>
              </Space>
            )}
          />
      </Table>

      </div>
    
  );

}

const mapStateToProps = state => ({
  userData : state.userData,
  userCount: state.userCount
})

export default connect(mapStateToProps)(ApplicationForm)