package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.RoleDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.RoleRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.RoleResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Role;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RoleService {

    @Autowired
    RoleDao roleDao;

    @Autowired
    ModelMapper modelMapper;

    public List<RoleResponseDto> getAllRoles() {
        return roleDao.findAll()
                .stream()
                .map(role -> modelMapper.map(role, RoleResponseDto.class))
                .collect(Collectors.toList());
    }

    public RoleResponseDto getRoleById(Long id) {
        Role role = roleDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));
        return modelMapper.map(role, RoleResponseDto.class);
    }

    public RoleResponseDto createRole(RoleRequestDto roleRequestDto) {
        roleDao.findByRoleName(roleRequestDto.getRoleName()).ifPresent(r -> {
            throw new IllegalArgumentException("Role already exists: " + roleRequestDto.getRoleName());
        });
        Role role = modelMapper.map(roleRequestDto, Role.class);
        Role saved = roleDao.save(role);
        return modelMapper.map(saved, RoleResponseDto.class);
    }

    public RoleResponseDto updateRole(Long id, RoleRequestDto roleRequestDto) {
        Role existing = roleDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));
        existing.setRoleName(roleRequestDto.getRoleName());
        existing.setDescription(roleRequestDto.getDescription());
        Role saved = roleDao.save(existing);
        return modelMapper.map(saved, RoleResponseDto.class);
    }

    public void deleteRole(Long id) {
        Role existing = roleDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + id));
        roleDao.delete(existing);
    }
}
