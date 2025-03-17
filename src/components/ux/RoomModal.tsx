'use client'
import {
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@heroui/react";

import { useScheduleData } from "@/hooks/useScheduleData";

import CreateRoom from "../admin/CreateRoom";
import { School } from "lucide-react";
  
  export default function RoomModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { teachers, courses, rooms, isLoading } = useScheduleData();
    return (
      <>
        <Button onPress={onOpen} className="font-bold text-md">        <School/>          </Button>
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
          
                <ModalBody>            
       

             <CreateRoom/>
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
  