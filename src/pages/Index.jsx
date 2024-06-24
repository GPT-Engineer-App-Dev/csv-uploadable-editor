import React, { useState } from "react";
import { Container, VStack, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton, Box, Heading, Flex, Spacer, useToast, Button } from "@chakra-ui/react";
import { FaTrash, FaPlus } from "react-icons/fa";
import Papa from "papaparse";
import { CSVLink } from "react-csv";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const toast = useToast();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setHeaders(result.meta.fields);
          setCsvData(result.data);
          toast({
            title: "File uploaded successfully.",
            description: "Your CSV file has been parsed.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
      });
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleCellChange = (index, field, value) => {
    const newData = [...csvData];
    newData[index][field] = value;
    setCsvData(newData);
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Container centerContent maxW="container.xl" py={10}>
        <VStack spacing={4} width="100%">
          <Heading as="h1" size="xl" mb={6}>CSV Upload, Edit, and Download Tool</Heading>
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
          {csvData.length > 0 && (
            <>
              <Table variant="simple" mt={4}>
                <Thead>
                  <Tr>
                    {headers.map((header, index) => (
                      <Th key={index}>{header}</Th>
                    ))}
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {csvData.map((row, rowIndex) => (
                    <Tr key={rowIndex}>
                      {headers.map((header, colIndex) => (
                        <Td key={colIndex}>
                          <Input
                            value={row[header] || ""}
                            onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                          />
                        </Td>
                      ))}
                      <Td>
                        <IconButton
                          aria-label="Remove row"
                          icon={<FaTrash />}
                          onClick={() => handleRemoveRow(rowIndex)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex width="100%" justify="space-between" align="center" mt={4}>
                <Button leftIcon={<FaPlus />} onClick={handleAddRow}>
                  Add Row
                </Button>
                <CSVLink data={csvData} headers={headers} filename={"edited_data.csv"}>
                  <Button>Download CSV</Button>
                </CSVLink>
              </Flex>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Index;