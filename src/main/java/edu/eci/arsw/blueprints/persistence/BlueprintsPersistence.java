package edu.eci.arsw.blueprints.persistence;

import edu.eci.arsw.blueprints.model.Blueprint;
import java.util.Set;

/**
 *
 * @author hcadavid
 * @author Juan Pablo Daza Pereira
 */
public interface BlueprintsPersistence {

    /**
     *
     * @param bp the new blueprint
     * @throws BlueprintPersistenceException if a blueprint with the same name already exists,
     *    or any other low-level persistence error occurs.
     */
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException;

    /**
     *
     * @param author blueprint's author
     * @param bprintname blueprint's author
     * @return the blueprint of the given name and author
     * @throws BlueprintNotFoundException if there is no such blueprint
     */
    public Blueprint getBlueprint(String author,String bprintname) throws BlueprintNotFoundException;

    /**
     *
     * @param author blueprint's author
     * @return all the blueprints of the given author
     * @throws BlueprintNotFoundException if the given author doesn't exist
     */
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException;

    /**
     *
     * @return all the blueprints
     */
    public Set<Blueprint> getAllBlueprints();

    /**
     * Updates an existing blueprint
     *
     * @param bp the blueprint to update
     * @throws BlueprintNotFoundException if the blueprint doesn't exist
     */
    public void updateBlueprint(Blueprint bp) throws BlueprintNotFoundException;

    /**
     * Deletes a blueprint with the given author and name
     *
     * @param author blueprint's author
     * @param bprintname blueprint's name
     * @throws BlueprintNotFoundException if there is no such blueprint
     */
    public void deleteBlueprint(String author, String bprintname) throws BlueprintNotFoundException;
}