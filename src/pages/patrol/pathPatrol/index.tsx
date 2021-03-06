/*
 * @Author: Dad
 * @Date: 2021-03-09 11:17:52
 * @LastEditors: Dad
 * @LastEditTime: 2021-03-09 13:56:08
 */
import React, { useState, useEffect, useRef } from 'react';
import { connect, history } from 'umi';
import { Dispatch, AnyAction } from 'redux';
import { Button, Col, Row, Form, Select, Table, message, Dropdown, Menu, Space, Popconfirm, Pagination } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { getpages, getIntersectionInfo, Delete } from './service'
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, AUDIT_STATUS } from '@/const'
import ModalForm from './ModalForm'
import _ from 'lodash';
import style from './index.less';
// import moment from 'moment';

interface CompProps {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const PatrolTask: React.FC<CompProps> = ({ dispatch, loading }) => {
  const [form] = Form.useForm();
  const [TableData, setTableData] = useState<any>([]);
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('look');
  const [rowData, setRowData] = useState<object>({});
  const [intersectionList, setIntersectionList] = useState<any>([]);


  useEffect(() => {
    getIntersectionList();
  }, []);

  useEffect(() => {
    initList()
  }, [currPage, pageSize]);

  /**
  * @name: 获取所有路口信息
  */
  const getIntersectionList = async () => {
    try {
      const { code, data, msg } = await getIntersectionInfo();
      if (code == 0) setIntersectionList(data)
      else message.error(msg)
    } catch (error) { }
  };

  /**
   * @name: 列表加载
   */
  const initList = async () => {
    const param = form?.getFieldsValue();
    const { code, data, msg } = await getpages({ current: currPage, size: pageSize, template: { ...param } })
    if (code === 0) setTableData(data.records)
    else message.success(msg)
  }

  const handleEidt = (param: any) => {
    setModalType('编辑')
    setmodalVisible(true)
    setRowData(param)
  }

  const handleDetele = async (param: any) => {
    const { code, msg } = await Delete(param.id)
    if (code === 0) message.success('删除成功'), initList()
    else message.warning(msg)
  }

  const menu = (data: any) => {
    return (
      <Menu>
        <Menu.Item key="1" onClick={() => { }}>查看</Menu.Item>
        <Menu.Item key="2" onClick={() => handleEidt(data)}>编辑</Menu.Item>
        <Menu.Item key="3">
          <Popconfirm title="是否确认删除?" onConfirm={() => handleDetele(data)}>
            删除
          </Popconfirm>
        </Menu.Item>
        <Menu.Item key="4" onClick={() => { }}>驳回原因</Menu.Item>
      </Menu>
    )
  };

  const columns = [
    {
      title: '巡检日期',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '巡检负责人',
      dataIndex: 'publicSentimentType',
      key: 'publicSentimentType',
    },
    {
      title: '巡检路口/路线',
      dataIndex: 'inspScheduleInspector',
      key: 'inspScheduleInspector',
    },
    {
      title: '巡检项目数量',
      dataIndex: 'CompletionTime',
      key: 'CompletionTime',
      valueType: 'date',
      // render: (item: any) => moment(item).format("YYYY-MM-DD")
    },
    {
      title: '异常项目',
      dataIndex: 'inspScheduleAllocationTime',
      key: 'inspScheduleAllocationTime',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: '操作',
      dataIndex: 'name',
      key: 'id',
      width: '300px',
      render: (text: any, record: any) => (
        <Space>
          <a onClick={() => {}}>提交审核</a>
          <a onClick={() => {}}>重新提交</a>
          <Dropdown overlay={menu(record)}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <EllipsisOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form {...layout} name="formList" form={form} initialValues={{ remember: true }}>
        <Row>
          <Col span={2}>
            <Button type="primary" shape="round" onClick={() => { setmodalVisible(true), setModalType('新增') }}>新增巡检单</Button>
          </Col>
          <Col span={6}>
            <Form.Item {...layout} label="巡检人" name="correlateIntersection">
              <Select placeholder="全部">
                {_.map(intersectionList, (item: any,) => (
                  <Select.Option key={item?.intersectionCode} value={item?.intersectionName}>
                    {item?.intersectionName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item {...layout} label="路径" name="correlateIntersection">
              <Select placeholder="全部">
                {_.map(intersectionList, (item: any,) => (
                  <Select.Option key={item?.intersectionCode} value={item?.intersectionName}>
                    {item?.intersectionName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item {...layout} label="状态" name="correlateIntersection">
              <Select placeholder="全部">
                {_.map(AUDIT_STATUS, (item: any,) => (
                  <Select.Option key={item?.intersectionCode} value={item?.intersectionName}>
                    {item?.intersectionName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Space>
              <Button type="primary" onClick={() => initList()}>确认</Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <div className={style.table}>
        <Table columns={columns} dataSource={TableData} rowKey='id' pagination={false} />
        <div className="global-pagination" >
          <Pagination showQuickJumper defaultCurrent={currPage} total={TableData?.length} onChange={(val: number, pageSize?: number) => {setCurrPage(val),pageSize?setPageSize(pageSize):null}} />
        </div>
      </div>
      <ModalForm modalVisible={modalVisible} initList={initList} onCancel={() => setmodalVisible(false)} ModalType={modalType} editData={rowData} />
    </div >
  )
}

export default connect(({ loading }: any) => ({
  loading: loading.effects['productManagerList/fetchList'],
}))(PatrolTask);