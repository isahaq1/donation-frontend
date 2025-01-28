"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCoas } from "@/redux/slices/coaSlice";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";

interface Coa {
  id?: number;
  coaName: string;
  coaType: string;
  isGroupHead: number;
  keyWord: string;
  parentId: number;
  sortBy: number;
  groupName: string;
  groupCode: string;
  companyCode: string;
  isSpecialGl: number;
  gcBk: string;
  children?: Coa[];
}

const CoaTreeView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coas, loading, error } = useSelector((state: RootState) => state.coa);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    dispatch(fetchCoas());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const buildTree = (list: Coa[], parentId: number | null = null): Coa[] => {
    return list
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        ...item,
        children: buildTree(list, item.id),
      }));
  };

  const treeData = buildTree(coas, 0); // Default to show items with parentId = 0

  const handleToggle = (id: number) => {
    setExpandedNodes((prev) => {
      const newExpandedNodes = new Set(prev);
      if (newExpandedNodes.has(id)) {
        newExpandedNodes.delete(id);
      } else {
        newExpandedNodes.add(id);
      }
      return newExpandedNodes;
    });
  };

  const renderTree = (nodes: Coa[]) => (
    <ul className="ml-4">
      {nodes.map((node) => (
        <li key={node.id} className="mb-2">
          <div
            onClick={() => handleToggle(node.id!)}
            className="cursor-pointer"
          >
            {node.isGroupHead ? (
              expandedNodes.has(node.id!) ? (
                <FaFolderOpen className="mr-2 inline text-yellow-500" />
              ) : (
                <FaFolder className="mr-2 inline text-yellow-500" />
              )
            ) : (
              <FaFile className="mr-2 inline text-blue-500" />
            )}
            {node.coaName}
          </div>
          {expandedNodes.has(node.id!) &&
            node.children &&
            node.children.length > 0 && (
              <div className="ml-4">{renderTree(node.children)}</div>
            )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Chart of Accounts</h1>
      {renderTree(treeData)}
    </div>
  );
};

export default CoaTreeView;
