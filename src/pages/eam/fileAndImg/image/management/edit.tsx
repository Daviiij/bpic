/*
 * @Author: Dad
 * @Date: 2021-03-11 10:28:28
 * @LastEditors: Dad
 * @LastEditTime: 2021-03-24 17:30:54
 */
import { FC, useState } from 'react';
import React, { useEffect } from 'react';
import _ from 'lodash';
import { Card, List, Image, message } from 'antd';
import styles from './edit.less';
import { getImageList, deleteFile } from './../../services';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ImgUpload from './ImgUpload';

interface ImagesProps {
  location: any;
}

export const Comp: FC<ImagesProps> = ({ location }) => {
  const {
    query: { businessType, businessId },
  } = location;
  const [list, setList] = useState<any>();
  const [visible, setVisible] = useState<any>();
  const [rowData, setRowData] = useState<any>();
  const [imgUrl, setImgUrl] = useState<any>('');

  useEffect(() => {
    if (_.isEmpty(businessType)) return;
    initList();
  }, []);
  /**
   * @name: 列表加载
   */
  const initList = async () => {
    const { code, data, msg } = await getImageList({
      template: { businessType },
      size: '-1',
    });
    console.log(data);
    if (code == 0) setList(data);
    else message.error(msg);
  };

  const deleteImg = async (id: any) => {
    const { code, msg } = await deleteFile(id);
    if (code == 0) {
      message.success('删除成功');
      initList();
    } else message.error(msg);
  };

  return (
    <>
      <List
        grid={{ gutter: 20, column: 3 }}
        dataSource={list?.records}
        renderItem={(item: any) => (
          <List.Item>
            <Card
              hoverable
              bodyStyle={{ paddingBottom: 20 }}
              actions={[
                <a
                  onClick={() => {
                    setVisible(true);
                    setRowData(item);
                    setImgUrl(item?.filePath);
                  }}
                >
                  <EditOutlined /> 编 辑{' '}
                </a>,
                <a onClick={() => deleteImg(item?.id)}>
                  <DeleteOutlined /> 删 除{' '}
                </a>,
              ]}
            >
              <Image width={'100%'} height={'180px'} src={item?.filePath} />
              <span style={{ marginTop: 10 }}>{item?.desc}</span>
            </Card>
          </List.Item>
        )}
      />
      <ImgUpload
        visible={visible}
        rowData={rowData}
        type={'edit'}
        initList={initList}
        initialValues={{ businessType, businessId }}
        closeModal={() => setVisible(false)}
        imgUrl={imgUrl}
      />
    </>
  );
};

export default Comp;
