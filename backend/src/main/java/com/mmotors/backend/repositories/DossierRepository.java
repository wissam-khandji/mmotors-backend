package com.mmotors.backend.repositories;

import com.mmotors.backend.entities.Dossier;
import com.mmotors.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DossierRepository extends JpaRepository<Dossier, Long> {
    List<Dossier> findByUser(User user);
}
