'use client'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@heroui/react";

import { useScheduleData } from "@/hooks/useScheduleData";

import CreateCourse from "../admin/dashboard/CreateCourse";
  
  export default function CourseModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { teachers, courses, rooms, isLoading } = useScheduleData();
    return (
      <>
        <Button onPress={onOpen} className="font-bold text-md">                   <span className="rounded-full border-2 p-1">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12h14"></path>
                      </svg>
        </span></Button>
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          disableAnimation={isLoading}
        >
          <ModalContent>
            {(onClose) => (
              <>
               
        
                  <ModalBody className=" ">             
                         
                  
                               <CreateCourse/>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                     Annuler
                    </Button>
                  </ModalFooter>
          
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  